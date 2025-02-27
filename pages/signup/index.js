import DefaultLayout from "@/layouts/default";
import React, { useState, useEffect, useRef } from "react";
import { Container, Form, FormGroup, FormLabel, FormControl} from "react-bootstrap";
import { useUser,useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {EyeFilledIcon} from "../../components/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../../components/EyeSlashFilledIcon";
import { PencilIcon } from "@heroicons/react/24/solid";
import { FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa';
import Image from "next/image";
import { useRouter } from 'next/router';

// Single CDN URL for files and avatars
const CDNURL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/files/";
const AVATAR_CDN_URL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/avatars/";

export default function IndexPage() {
  const [ email, setEmail ] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [ files, setFiles ] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  const [activeTab, setActiveTab] = useState("signin");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileDescriptions, setFileDescriptions] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [userDescription, setUserDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [twitter, setTwitter] = useState(user?.twitter || '');
  const [discord, setDiscord] = useState(user?.discord || '');
  const [website, setWebsite] = useState(user?.website || '');
  const fileInputRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState({});
  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '');

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function getFiles() {
    const { data, error } = await supabase
      .storage
      .from('files')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: {column: "name", order: "asc"}
      });
  
    if (error) {
      console.log("Error loading files:", error);
      return;
    }
  
    // Fetch descriptions for these files
    const { data: descData, error: descError } = await supabase
      .from('file_descriptions')
      .select('*')
      .eq('user_id', user.id);
  
    if (descError) {
      console.error("Error fetching descriptions:", descError);
    } else {
      // Combine file data with descriptions
      const filesWithDesc = data.map(file => ({
        ...file,
        description: descData.find(desc => desc.file_name === file.name)?.description || '',
        fileType: descData.find(desc => desc.file_name === file.name)?.file_type || ''
      }));
      setFiles(filesWithDesc);
    }
  }

  useEffect(() => {
    if(user) {
      getFiles();
      setEditableName(user.user_metadata?.name || user.email?.split('@')[0] || '');
      async function refreshUserData() {
        try {
          const { data: { user: freshUser } } = await supabase.auth.getUser();
          
          // Check if user exists before trying to fetch profile
          if (!freshUser) return;
          
          // Fetch user profile data including description, socials, and avatar
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('description, twitter, discord, website, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
            
            // If profile doesn't exist, create it
            if (error.code === 'PGRST116') {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({ 
                  id: user.id, 
                  email: user.email,
                  name: user.user_metadata?.name || user.email.split('@')[0]
                });
                
              if (insertError) {
                console.error("Error creating profile:", insertError);
              }
            }
          } else {
            setUserDescription(profileData.description || "");
            setTwitter(profileData.twitter || "");
            setDiscord(profileData.discord || "");
            setWebsite(profileData.website || "");
            setAvatar(profileData.avatar_url || "");
          }
        } catch (err) {
          console.error("Error in refreshUserData:", err);
        }
      }
      refreshUserData();
    }
  }, [user]);
  
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (error) {
      alert("Error signing in: " + error.message);
    } else {
      console.log("Signed in:", data);
      
      // Get user data including role
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (!userError && userData) {
        // Redirect admin users to admin panel
        if (userData.role === 'admin') {
          router.push('/admin');
        }
      }
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, email: email }, { onConflict: 'id' });
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
      }
    }
  }
  
  async function signUpWithEmail() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name
          // Role will be set to 'user' by default in the database
        }
      }
    });
  
    if (error) {
      alert("Error signing up: " + error.message);
    } else {
      try {
        // Create profile with default role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            name: name, 
            email: email
            // Role will default to 'user' in the database
          }, { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        alert("Signed up successfully! Please check your email for verification.");
      } catch (err) {
        console.error("Error in profile creation:", err);
        alert("Signed up successfully! Your profile will be created when you first log in.");
      }
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  
  async function updateUserDescription() {
    const { error } = await supabase
      .from('profiles')
      .update({ description: userDescription })
      .eq('id', user.id);
  
    if (error) {
      console.error("Error updating user description:", error);
      alert("Failed to update description");
    } else {
      alert("Description updated successfully");
    }
  }
  
  async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_avatar.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      // Skip bucket check since we know it exists
      // Upload directly to avatars bucket
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        alert('Error uploading avatar: ' + uploadError.message);
      } else {
        setAvatar(filePath);
        updateProfile({ avatar: filePath });
      }
    } catch (err) {
      console.error("Error in handleAvatarUpload:", err);
      alert('Error uploading avatar: ' + err.message);
    }
  }
  
  async function updateProfile({ avatar }) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatar })
        .eq('id', user.id);
  
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  }

  async function deleteContent(file) {
    const { data, error } = await supabase
      .storage
      .from('files')
      .remove([`${user.id}/${file.name}`]);
  
    if (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    } else {
      // Remove the file from state
      setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name));
  
      // Delete the description
      const { error: descError } = await supabase
        .from('file_descriptions')
        .delete()
        .match({ user_id: user.id, file_name: file.name });
  
      if (descError) {
        console.error("Error deleting description:", descError);
      }
  
      alert("File deleted successfully");
    }
  }
  
  async function updateSocialMedia() {
    const { error } = await supabase
      .from('profiles')
      .update({ twitter, discord, website })
      .eq('id', user.id);
  
    if (error) {
      console.error("Error updating social media:", error);
      alert("Failed to update social media");
    } else {
      alert("Social media updated successfully");
      setIsEditingSocial(false);
    }
  }
  
  async function handleMultipleUpload() {
    if (selectedFiles.length === 0) {
      alert("Please select files first");
      return;
    }
  
    // Create an array to track upload promises
    const uploadPromises = [];
    
    // Process each file
    for (const file of selectedFiles) {
      const fileName = uuidv4();
      const fileExt = file.name.split('.').pop();
      const fullFileName = `${fileName}.${fileExt}`;
      const description = fileDescriptions[file.name] || "";
      
      // Start the upload and track progress
      const uploadPromise = new Promise(async (resolve, reject) => {
        try {
          // Update progress state to show starting
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { progress: 0, status: 'uploading' }
          }));
          
          // Upload the file
          const { data, error } = await supabase
            .storage
            .from('files')
            .upload(user.id + "/" + fullFileName, file);
          
          if (error) {
            console.error("Error uploading file:", error);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { progress: 0, status: 'error', message: error.message }
            }));
            reject(error);
            return;
          }
          
          // Add the description to a separate table
          const { error: descError } = await supabase
            .from('file_descriptions')
            .insert({ 
              user_id: user.id, 
              file_name: fullFileName, 
              description: description,
              file_type: file.type
            });
          
          if (descError) {
            console.error("Error saving description:", descError);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { progress: 100, status: 'warning', message: 'File uploaded but description failed' }
            }));
          } else {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { progress: 100, status: 'success' }
            }));
          }
          
          resolve(data);
        } catch (err) {
          console.error("Upload error:", err);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { progress: 0, status: 'error', message: err.message }
          }));
          reject(err);
        }
      });
      
      uploadPromises.push(uploadPromise);
    }
    
    // Wait for all uploads to complete
    try {
      await Promise.allSettled(uploadPromises);
      getFiles(); // Refresh the file list
      
      // Clear the form after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setFileDescriptions({});
        setUploadProgress({});
      }, 3000);
      
    } catch (err) {
      console.error("Error in batch upload:", err);
    }
  }

  function handleFilesSelect(e) {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Initialize descriptions for new files
    const newDescriptions = {};
    const newPreviews = {};
    
    files.forEach(file => {
      newDescriptions[file.name] = "";
      
      // Generate preview URLs for images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const previewUrl = URL.createObjectURL(file);
        newPreviews[file.name] = previewUrl;
      }
    });
    
    setFileDescriptions(newDescriptions);
    setFilePreviews(newPreviews);
  }
  
  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      // Revoke all object URLs to avoid memory leaks
      Object.values(filePreviews).forEach(URL.revokeObjectURL);
    };
  }, [filePreviews]);
  
  function removeSelectedFile(fileName) {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    
    setFileDescriptions(prev => {
      const newDescriptions = {...prev};
      delete newDescriptions[fileName];
      return newDescriptions;
    });
    
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[fileName];
      return newProgress;
    });
    
    // Revoke the object URL when removing a file
    if (filePreviews[fileName]) {
      URL.revokeObjectURL(filePreviews[fileName]);
      setFilePreviews(prev => {
        const newPreviews = {...prev};
        delete newPreviews[fileName];
        return newPreviews;
      });
    }
  }

  function handleDescriptionChange(fileName, description) {
    setFileDescriptions(prev => ({
      ...prev,
      [fileName]: description
    }));
  }

  // Helper function to render file preview based on type
  function renderFilePreview(file) {
    const fileUrl = `${CDNURL}${user?.id}/${file.name}`;
    
    if (file.fileType?.startsWith('video/')) {
      return (
        <video 
          width="175" 
          height="175" 
          controls 
          className="object-cover rounded-xl aspect-square"
        >
          <source src={fileUrl} type={file.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Image
          src={fileUrl}
          alt={file.description}
          width={175}
          height={175}
          className="object-cover rounded-xl aspect-square"
        />
      );
    }
  }

  // Function to render file preview based on type
  function renderFilePreviewForUpload(file) {
    const preview = filePreviews[file.name];
    
    if (!preview) {
      return (
        <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-500">{file.name.split('.').pop()}</span>
        </div>
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <video 
          width="80" 
          height="80" 
          className="object-cover rounded-md"
        >
          <source src={preview} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Image
          src={preview}
          alt={file.name}
          width={80}
          height={80}
          className="object-cover rounded-md"
        />
      );
    }
  }

  async function updateUserName() {
    try {
      // Update the user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: editableName }
      });
      
      if (authError) throw authError;
      
      // Also update the name in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: editableName })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      alert("Name updated successfully");
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name: " + error.message);
    }
  }

  return (
    <DefaultLayout>
      <Container className="flex flex-col items-center justify-center gap-6 h-screen">
      {user === null ?
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("signin")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "signin"
                    ? "bg-[#9564b4] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "signup"
                    ? "bg-[#9564b4] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {activeTab === "signin" ? (
            <div className=" p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
              <Form>
                <FormGroup className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-6">
                  <FormLabel>Password</FormLabel>
                  <Input
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  className="w-full bg-[#9564b4]"
                  onClick={signInWithEmail}
                >
                  Sign In
                </Button>
              </Form>
            </div>
          ) : (
            <div className=" p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
              <Form>
                <FormGroup className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-6">
                  <FormLabel>Password</FormLabel>
                  <Input
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  className="w-full bg-[#9564b4]"
                  onClick={signUpWithEmail}
                >
                  Sign Up
                </Button>
              </Form>
            </div>
          )}
        </div>
      :
        <>
          {/* Your profile */}
          <div className="w-full flex flex-col max-w-7xl mx-auto min-h-screen">
            {/* Avatar and Header Profile */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-6">
                <div className="">
                  {user && (
                    <div className="relative flex flex-col items-center">
                      {avatar ? (
                        <img
                          src={`${AVATAR_CDN_URL}${avatar}`}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">No Avatar</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-[#9564b4] rounded-full p-1 shadow-md hover:bg-purple-700 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  {isEditingName ? (
                    <div className="flex flex-col sm:w-[400px] w-full">
                      <Input
                        className="w-full"
                        type="text"
                        label="Your Name"
                        placeholder="Enter your name"
                        value={editableName}
                        onChange={(e) => setEditableName(e.target.value)}
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <Button color="success" onClick={updateUserName}>Save</Button>
                        <Button color="danger" onClick={() => setIsEditingName(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <h1 className="font-atirose text-[#9564b4] sm:text-5xl text-3xl">
                        {user.user_metadata?.name || user.email?.split('@')[0]}'s Profile
                      </h1>
                      <button 
                        onClick={() => setIsEditingName(true)} 
                        className="ml-2 bg-transparent border-none cursor-pointer"
                      >
                        <PencilIcon className="h-5 w-5 text-[#9564b4]"/>
                      </button>
                    </div>
                  )}
                  <p className="text-grey text-sm sm:block hidden">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <Button color="danger" className="w-fit  sm:text-sm text-sm font-bold" onClick={() => signOut()}>Sign Out</Button>
              </div>
            </div>

            {/* Description and Socials */}
            <div className="mt-4 flex flex-col gap-1">
              {isEditingDescription ? (
                <div className="flex flex-col sm:w-[400px] w-full">
                  <Input
                    className="w-full mt-3 "
                    type="text"
                    label="User Description"
                    placeholder="Enter a description about yourself"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <Button color="success" className="" onClick={() => {updateUserDescription(); setIsEditingDescription(false);}}>Save</Button>
                    <Button color="danger" className="" onClick={() => setIsEditingDescription(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-foreground  text-sm mr-2">
                    {userDescription || "No description added yet"}
                  </p>
                  <button onClick={() => setIsEditingDescription(true)} className="bg-transparent border-none cursor-pointer">
                    <PencilIcon className="sm:h-4 sm:w-4 h-3 w-3 text-foreground"/>
                  </button>   
                </div>
              )}
            
              {isEditingSocial ? (
                <div className="flex flex-col sm:w-[400px] w-full max-w-md mt-4">
                  <Input
                    className="mt-3 "
                    type="text"
                    label="Twitter"
                    placeholder="Your Twitter username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                  <Input
                    className="mt-3 "
                    type="text"
                    label="Discord"
                    placeholder="Your Discord username"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                  />
                  <Input
                    className="mt-3 "
                    type="text"
                    label="Website"
                    placeholder="Your website URL"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button color="success" className="ml-2 " onClick={updateSocialMedia}>Save</Button>
                    <Button color="danger" className="ml-2 " onClick={() => setIsEditingSocial(false)}>Cancel</Button>
                  </div>
                </div>
                ) : (
                <div className="flex flex-col">
                  <div className="flex flex-row gap-3">
                    <h1 className=" text-sm text-foreground">Socials</h1>
                    <button 
                      onClick={() => setIsEditingSocial(true)}
                      className="bg-transparent border-none cursor-pointer"
                    >
                      <PencilIcon className="sm:h-4 sm:w-4 h-3 w-3 text-foreground" />
                    </button>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:space-x-4 mt-1">
                    {twitter && (
                      <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer" className="text-[#9564b4] font-atirose text-lg hover:text-foreground flex flex-row items-center gap-2">
                        <FaTwitter size={16}  className="text-foreground"/> {twitter}
                      </a>
                    )}
                    {discord && (
                      <span className="text-[#9564b4] font-atirose text-lg hover:text-foreground flex flex-row items-center gap-2" title={discord}>
                        <FaDiscord size={16} className="text-foreground"/> {discord}
                      </span>
                    )}
                    {website && (
                      <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#9564b4] font-atirose text-lg hover:text-foreground flex flex-row items-center gap-2">
                        <FaGlobe size={16} className="text-foreground"/> {website}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
              
            {/* Handle File Upload */}       
            <div className="sm:w-full w-full max-w-3xl">
              <p className="mt-8 sm:text-xl text-md font-medium">Upload your art here!</p>
              <div className="mt-3 p-4 border-1 border-darkviolet rounded-xl">
                <Input 
                  className="mt-3" 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif, video/mp4"  
                  onChange={(e) => handleFilesSelect(e)}
                  multiple
                />
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</p>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                      {selectedFiles.map((file) => (
                        <div key={file.name} className="border-1 border-darkviolet rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {/* File preview */}
                            {renderFilePreviewForUpload(file)}
                            
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            
                            <Button 
                              size="sm" 
                              color="danger" 
                              variant="light"
                              onClick={() => removeSelectedFile(file.name)}
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <Input
                            className="mt-2"
                            type="text"
                            placeholder="Add a description"
                            value={fileDescriptions[file.name] || ""}
                            onChange={(e) => handleDescriptionChange(file.name, e.target.value)}
                          />
                          
                          {uploadProgress[file.name] && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    uploadProgress[file.name].status === 'error' ? 'bg-red-600' :
                                    uploadProgress[file.name].status === 'warning' ? 'bg-yellow-400' :
                                    'bg-violet'
                                  }`} 
                                  style={{width: `${uploadProgress[file.name].progress}%`}}
                                ></div>
                              </div>
                              {uploadProgress[file.name].message && (
                                <p className="text-xs mt-1 text-red-500">{uploadProgress[file.name].message}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      color="success" 
                      className="bg-[#7d7d7d] text-sm text-white font-medium mt-4 w-full" 
                      onClick={handleMultipleUpload} 
                      disabled={selectedFiles.length === 0}
                    >
                      Upload All Files
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Show Files */}
            <div className="flex flex-row flex-wrap sm:gap-6 gap-3 mt-5 items-center">
              {files.map((file) => (
                <div className="flex flex-col items-center justify-between border-1 border-violet rounded-2xl w-fit p-4" key={`file-${user.id}-${file.name}`}>
                  <div className="sm:p-2 p-1">
                    {renderFilePreview(file)}
                  </div>
                  <p className="text-[#9564b4] font-atirose sm:text-md text-md">{file.description}</p>
                  <div className="p-3">
                    <Button className="text-white font-medium text-sm" color="danger" onClick={() => deleteContent(file)}>Delete File</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      </Container>
    </DefaultLayout>
  );
}
 