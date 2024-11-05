import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Trash2, UserPlus, Search, File, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

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
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    name: '',
    role: 'user',
  });

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
      
      const { error: storageError } = await supabase
        .storage
        .from(item.bucket)
        .remove([`${item.userId}/${item.name}`]);
      
      if (storageError) throw storageError;

      if (item.bucket === 'images') {
        await supabase
          .from('image_descriptions')
          .delete()
          .match({ user_id: item.userId, image_name: item.name });
      } else {
        await supabase
          .from('file_descriptions')
          .delete()
          .match({ user_id: item.userId, file_name: item.name });
      }

      await fetchAllContent();
      setError(null);
    } catch (err) {
      setError('Failed to delete content');
      console.error('Error:', err);
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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === 'all' || item.userId === selectedUser;
    return matchesSearch && matchesUser;
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Content Management
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div>
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Create New User</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={createUser}
                  disabled={loading || !newUser.email || !newUser.name}
                  className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Create User
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={loading}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

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

        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;