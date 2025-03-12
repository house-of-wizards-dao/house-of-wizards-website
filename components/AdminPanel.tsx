import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Trash2, UserPlus, Search, File, Image as ImageIcon, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Signout from "../pages/admin/login"
import DefaultLayout from '@/layouts/default';

// Update to use only the files bucket
const CDNURL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/files/";

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
  description?: string;
  fileType?: string;
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
        users.map(async (user) => {
          // Only fetch from files bucket
          const { data: fileData, error: fileError } = await supabase
            .storage
            .from('files')
            .list(user.id + "/");
            
          if (fileError) {
            console.error(`Error fetching files for user ${user.id}:`, fileError);
            return [];
          }
          
          // Get file descriptions
          const { data: descData, error: descError } = await supabase
            .from('file_descriptions')
            .select('*')
            .eq('user_id', user.id);
            
          if (descError) {
            console.error(`Error fetching descriptions for user ${user.id}:`, descError);
          }
          
          // Map files with descriptions
          return (fileData || []).map(file => {
            const fileDesc = descData?.find(desc => desc.file_name === file.name);
            return { 
              ...file, 
              userId: user.id, 
              userName: user.name,
              description: fileDesc?.description || '',
              fileType: fileDesc?.file_type || ''
            };
          });
        })
      );

      setContent(allContent.flat());
    } catch (err) {
      console.error("Error in fetchAllContent:", err);
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'content') {
        await fetchAllContent();
      }
    };

    fetchData();
  }, [activeTab]);

  const deleteContent = async (item: ContentItem) => {
    try {
      setLoading(true);
      console.log("Deleting file:", item); // Debug log
      
      // First, check if the file exists
      const { data: fileExists, error: fileCheckError } = await supabase
        .storage
        .from('files')
        .list(`${item.userId}/`, {
          search: item.name
        });
        
      console.log("File check result:", fileExists); // Log if file exists
      
      if (fileCheckError) {
        console.error("Error checking file existence:", fileCheckError);
      }
      
      // Delete from storage - make sure the path is correct
      const filePath = `${item.userId}/${item.name}`;
      console.log("File path to delete:", filePath); // Debug log
      
      const { error: storageError, data: storageData } = await supabase
        .storage
        .from('files')
        .remove([filePath]);
      
      if (storageError) {
        console.error("Storage error:", storageError); // Debug log
        throw storageError;
      }
      
      console.log("Storage deletion response:", storageData); // Log the response

      // Check if file_description exists
      const { data: descExists, error: descCheckError } = await supabase
        .from('file_descriptions')
        .select('*')
        .eq('user_id', item.userId)
        .eq('file_name', item.name);
        
      console.log("Description check result:", descExists); // Log if description exists
      
      if (descCheckError) {
        console.error("Error checking description existence:", descCheckError);
      }

      // Delete description from database
      const { error: descError, data: descData } = await supabase
        .from('file_descriptions')
        .delete()
        .eq('user_id', item.userId)
        .eq('file_name', item.name);
        
      if (descError) {
        console.error("Description error:", descError); // Debug log
        throw descError;
      }
      
      console.log("Description deletion response:", descData); // Log the response

      // Update local state
      setContent(prevContent => 
        prevContent.filter(
          content => !(content.userId === item.userId && content.name === item.name)
        )
      );

      setError(null);
      console.log("File deleted successfully"); // Debug log
      
      // Refresh the content list to verify deletion
      await fetchAllContent();
      
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
      
      // Create auth user with random password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      if (signUpError || !data.user) throw signUpError;

      // Check if profile already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
        
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        // Real error, not just "no rows returned"
        throw profileCheckError;
      }
      
      if (existingProfile) {
        // Profile exists, update it instead
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);
          
        if (updateError) throw updateError;
      } else {
        // Profile doesn't exist, insert new one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            created_at: new Date().toISOString()
          }]);
          
        if (insertError) throw insertError;
      }

      // Reset form and refresh user list
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
      
      // First delete all user content
      const userContent = content.filter(item => item.userId === userId);
      for (const item of userContent) {
        await deleteContent(item);
      }

      // Delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;

      // Delete from auth.users using the RPC function
      const { error: authError } = await supabase.rpc('delete_user', {
        user_id: userId
      });

      if (authError) {
        console.error("Error deleting auth user:", authError);
        // Continue anyway as we've deleted the profile
      }

      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setError(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredContent = content.filter(item => {
    const matchesSearch = 
      (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUser = selectedUser === 'all' || item.userId === selectedUser;
    
    return matchesSearch && matchesUser;
  });

  // Render file preview based on type
  const renderFilePreview = (item: ContentItem) => {
    const fileUrl = `${CDNURL}${item.userId}/${item.name}`;
    
    if (item.fileType?.startsWith('video/') || item.name.toLowerCase().endsWith('.mp4')) {
      return (
        <video 
          className="w-full h-32 object-cover rounded-md aspect-square"
          style={{ height: 'auto' }}
          controls
        >
          <source src={fileUrl} type={item.fileType || "video/mp4"} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (item.fileType?.startsWith('image/') || 
              ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => 
                item.name.toLowerCase().endsWith(`.${ext}`))) {
      return (
        <Image 
          src={fileUrl}
          alt={item.description || item.name}
          width={128}
          height={128}
          className="w-full h-32 object-cover rounded-md aspect-square"
          style={{ height: 'auto' }}
        />
      );
    } else {
      return (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md">
          <File className="h-12 w-12 text-gray-400" />
          <span className="ml-2 text-sm text-white">{item.name.split('.').pop()?.toUpperCase()}</span>
        </div>
      );
    }
  };

  return (
    <DefaultLayout>
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-violet">Admin Panel</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="border border-darkviolet shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-center 2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'text-violet'
                    : 'border-transparent text-white hover:violet hover:border-darkviolet'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-6 text-center  font-medium text-sm ${
                  activeTab === 'content'
                   ? 'text-violet'
                    : 'border-transparent text-white hover:violet hover:border-darkviolet'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-6 text-center  font-medium text-sm ${
                  activeTab === 'create'
                   ? 'text-violet'
                    : 'border-transparent text-white hover:violet hover:border-darkviolet'
                }`}
              >
                Create User
              </button>
            </nav>
          </div>

          <div className="px-4">
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-2 py-[7px] text-white text-sm w-full border border-darkviolet rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {activeTab === 'content' && (
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="ml-4 pl-3 pr-10 py-2 text-sm border border-darkviolet rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="border border-darkviolet shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-white ">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((item) => (
                <div key={`${item.userId}-${item.name}`} className="border border-darkviolet rounded-lg shadow-sm overflow-hidden">
                  <div className="p-2">
                    {renderFilePreview(item)}
                  </div>
                  <div className="p-4 border-t border-darkviolet">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-violet truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-white">{item.userName}</p>
                        {item.description && (
                          <p className="mt-1 text-xs text-gray-600">{item.description}</p>
                        )}
                        <button
                        onClick={() => deleteContent(item)}
                        disabled={loading}
                        className="mt-2 text-red-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && !loading && (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
                <p className="mt-1 text-sm text-white">
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
            <div className="border border-darkviolet p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Create New User</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border text-white text-sm border-darkviolet rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border text-white text-sm border-darkviolet rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                    className="w-full p-2 border text-white text-sm border-darkviolet rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={createUser}
                  disabled={loading || !newUser.email || !newUser.name}
                  className="w-full mt-6 bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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