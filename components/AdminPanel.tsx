import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Trash2, UserPlus, Search, File, Image as ImageIcon, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Signout from "../pages/admin/login"
import DefaultLayout from '@/layouts/default';
const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
}

interface ContentItem {
  name: string;
  userId: string;
  userName: string;
  bucket: 'images' | 'files';
  description?: string;
}

interface NewUser {
  email: string;
  name: string;
  role: 'user' | 'admin';
}

const AdminPanel = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'create'>('users');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    name: '',
    role: 'user',
  });

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/admin/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, name');

      if (userError) throw userError;

      const allContent = await Promise.all(
        users.flatMap(async (user) => {
          const [imageData, fileData] = await Promise.all([
            supabase.storage.from('images').list(user.id + "/"),
            supabase.storage.from('files').list(user.id + "/")
          ]);

          return [
            ...(imageData.data || []).map(img => ({ 
              ...img, 
              userId: user.id, 
              userName: user.name, 
              bucket: 'images' as const 
            })),
            ...(fileData.data || []).map(file => ({ 
              ...file, 
              userId: user.id, 
              userName: user.name, 
              bucket: 'files' as const 
            }))
          ];
        })
      );

      const [imageDescData, fileDescData] = await Promise.all([
        supabase.from('image_descriptions').select('*'),
        supabase.from('file_descriptions').select('*')
      ]);

      const contentWithDesc = allContent.flat().map(item => ({
        ...item,
        description: item.bucket === 'images'
          ? imageDescData.data?.find(desc => desc.image_name === item.name && desc.user_id === item.userId)?.description
          : fileDescData.data?.find(desc => desc.file_name === item.name && desc.user_id === item.userId)?.description
      }));

      setContent(contentWithDesc);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError('Failed to fetch content');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(profiles || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAllContent()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const deleteContent = async (item: ContentItem) => {
    try {
      setLoading(true);
      
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from(item.bucket)
        .remove([`${item.userId}/${item.name}`]);
      
      if (storageError) throw storageError;
  
      // Delete description from database
      if (item.bucket === 'images') {
        const { error: descError } = await supabase
          .from('image_descriptions')
          .delete()
          .match({ user_id: item.userId, image_name: item.name });
          
        if (descError) throw descError;
      } else {
        const { error: descError } = await supabase
          .from('file_descriptions')
          .delete()
          .match({ user_id: item.userId, file_name: item.name });
          
        if (descError) throw descError;
      }
  
      // Update local state
      setContent(prevContent => 
        prevContent.filter(
          content => !(content.bucket === item.bucket && 
                      content.userId === item.userId && 
                      content.name === item.name)
        )
      );
  
      setError(null);
    } catch (err) {
      console.error("Error deleting content:", err);
      setError('Failed to delete content');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      setLoading(true);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      if (signUpError || !data.user) throw signUpError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }]);

      if (profileError) throw profileError;

      setNewUser({ email: '', name: '', role: 'user' });
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError('Failed to create user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      const userContent = content.filter(item => item.userId === userId);
      for (const item of userContent) {
        await deleteContent(item);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;

      await fetchUsers();
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getUserContent = (userId: string) => {
    return content.filter(item => item.userId === userId);
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === 'all' || item.userId === selectedUser;
    return matchesSearch && matchesUser;
  });

  return (
    <DefaultLayout>
    <div className="max-w-7xl mx-auto mt-8 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif italic text-[#9564b4]">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'users'
                  ? 'bg-[#9564b4] text-sm text-center px-2 rounded-full border-4 border-[#3b2747]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'content'
                  ? 'bg-[#9564b4] text-sm text-center px-2 rounded-full border-4 border-[#3b2747]'
                  : 'text-sm text-center px-2 rounded-full border-4 border-[#3b2747]'
              }`}
            >
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'create'
                  ? 'bg-[#9564b4] text-sm text-center px-2 rounded-full border-4 border-[#3b2747]'
                  : 'text-sm text-center px-2 rounded-full border-4 border-[#3b2747]'
              }`}
            >
              Create User
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div className="" key={user.id}>
                <div 
                  className="p-4 rounded-xl border-1 border-[#3b2747] flex items-center justify-between cursor-pointer"
                  onClick={() => toggleUserExpand(user.id)}
                >
                  <div>
                    <div className=" flex flex-row gap-3 items-center">
                    <p className="font-medium">{user.name}</p>
                    <span className="bg-[#9564b4] text-sm text-center px-2 rounded-full border-4 border-[#3b2747]">
                      {user.role}
                    </span>
                    </div>
                    <p className="text-sm text-white mt-2">{user.email}</p>
                    
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user.id);
                      }}
                      disabled={loading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedUser === user.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedUser === user.id && (
                  <div className="p-4 mt-2 ">
                    <h4 className="text-sm font-medium text-white text-center">User Uploads</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {getUserContent(user.id).map((item) => (
                        <div key={`${item.bucket}-${item.name}`} className="p-3 mt-4 h-full border-1 rounded-xl border-[#3b2747]">
                          <div className="flex flex-col  items-center justify-center gap-3">
                          <button
                              onClick={() => deleteContent(item)}
                              disabled={loading}
                              className="p-1.5 flex justify-end w-full text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-">
                              {item.bucket === 'files' && item.name.toLowerCase().endsWith('.mp4') ? (
                                <video className="w-full object-cover aspect-square rounded-xl">
                                  <source src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`} type="video/mp4" />
                                </video>
                              ) : (
                                <Image
                                  src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`}
                                  alt={item.description || item.name}
                                  width={396}
                                  height={396}
                                  className="rounded-xl w-full aspect-square object-cover"
                                  unoptimized={item.name.toLowerCase().endsWith('.gif')}
                                />
                              )}
                            </div>
                            <div className="mt-2">
                            {item.description && (
                              <p className="text-xs text-white w-[200px] text-center">{item.description}</p>
                            )}
                          </div>
                          </div>
                          
                        </div>
                      ))}
                      
                      {getUserContent(user.id).length === 0 && (
                        <div className="col-span-full text-center py-4 text-gray-500 text-sm">
                          No uploads found for this user
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

{users.length === 0 && !loading && (
              <div className="text-center py-10">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredContent.map((item) => (
                <div key={`${item.bucket}-${item.userId}-${item.name}`} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {item.bucket === 'files' && item.name.toLowerCase().endsWith('.mp4') ? (
                        <video className="w-32 h-32 object-cover rounded-lg">
                          <source src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`}
                          alt={item.description || item.name}
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg"
                          unoptimized={item.name.toLowerCase().endsWith('.gif')}
                        />
                      )}
                      <div>
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">By {item.userName}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500 truncate">{item.description}</p>
                        )}
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {item.bucket}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContent(item)}
                      disabled={loading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && !loading && (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedUser !== 'all' 
                    ? 'Try adjusting your filters.'
                    : 'Users havent uploaded any content yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Create New User</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={createUser}
                  disabled={loading || !newUser.email || !newUser.name}
                  className="w-full mt-6 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default AdminPanel;