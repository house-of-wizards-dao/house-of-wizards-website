import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaTwitter, FaDiscord, FaGlobe } from "react-icons/fa";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import {
  IoIosCloseCircle,
  IoIosArrowRoundBack,
  IoIosArrowRoundForward,
} from "react-icons/io";
import { Button } from "@nextui-org/button";

import DefaultLayout from "@/layouts/default";
import { Profile } from "@/types";

// CDN URLs
const CDNURL =
  "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/files/";
const AVATAR_CDN_URL =
  "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/avatars/";
const FILES_PER_PAGE = 15;

interface FileItem {
  name: string;
  id?: string;
  description?: string;
  fileType?: string;
  created_at?: string;
  updated_at?: string;
}

interface FileDescription {
  file_name: string;
  description: string;
  file_type: string;
  user_id: string;
}

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<Profile | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination
  const indexOfLastItem = currentPage * FILES_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - FILES_PER_PAGE;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

  const fetchUserData = useCallback(async (): Promise<Profile | null> => {
    if (!userId || typeof userId !== "string") return null;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, name, email, description, twitter, discord, website, avatar_url, created_at",
      )
      .eq("id", userId)
      .single();

    if (data) {
      setUser(data);

      return data;
    } else if (error) {
      setUser(null);

      return null;
    }

    return null;
  }, [userId, supabase]);

  useEffect(() => {
    if (userId && typeof userId === "string") {
      setLoading(true);
      Promise.all([fetchUserData()])
        .then(([userData]) => userData && getFiles(userData))
        .finally(() => setLoading(false));
    }
  }, [userId, fetchUserData]);

  async function getFiles(userData: Profile): Promise<void> {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .list(userData.id + "/", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error || !data) {
        return;
      }

      const { data: descData, error: descError } = await supabase
        .from("file_descriptions")
        .select("file_name, description, file_type, created_at")
        .eq("user_id", userData.id);

      if (descError || !descData) {
        setFiles(
          data.map((file) => ({
            ...file,
            description: "",
            fileType: "",
          })),
        );
      } else {
        const filesWithDesc = data.map((file) => ({
          ...file,
          description:
            descData.find((desc: any) => desc.file_name === file.name)
              ?.description || "",
          fileType:
            descData.find((desc: any) => desc.file_name === file.name)
              ?.file_type || "",
        }));

        setFiles(filesWithDesc);
      }
    } catch (error) {
      // Handle error silently
      setFiles([]);
    }
  }

  function renderFilePreview(file: FileItem): JSX.Element {
    const fileUrl = `${CDNURL}${user?.id}/${file.name}`;

    if (file.fileType?.startsWith("video/")) {
      return (
        <video
          controls
          className="object-cover rounded-xl aspect-square"
          height="350"
          width="350"
        >
          <source src={fileUrl} type={file.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.fileType?.startsWith("image/")) {
      return (
        <Image
          alt={file.description || "User uploaded image"}
          className="object-cover rounded-xl aspect-square"
          height={350}
          src={fileUrl}
          unoptimized
          width={350}
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center w-[350px] h-[350px] bg-[#1c1c1c] rounded-xl">
          <p className="text-white text-lg">File: {file.name}</p>
        </div>
      );
    }
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner color="default" labelColor="foreground" />
        </div>
      </DefaultLayout>
    );
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">User not found</p>
        </div>
      </DefaultLayout>
    );
  }

  const openModal = (item: FileItem): void => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: FileItem): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(item);
    }
  };

  return (
    <DefaultLayout>
      <div className="container flex flex-col items-center max-w-7xl mx-auto px-4">
        <Image
          alt={`${user.name || "User"}'s avatar`}
          className="rounded-full mb-6 object-cover"
          height={150}
          src={
            user.avatar_url && user.avatar_url.startsWith("http")
              ? user.avatar_url
              : user.avatar_url
                ? `${AVATAR_CDN_URL}${user.avatar_url}`
                : "/img/logo.png"
          }
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
          unoptimized
          width={150}
        />
        <h1 className="font-serif text-[#9564b4] italic sm:text-4xl text-3xl">
          {user.name || "User"}&apos;s Work
        </h1>
        <p className="font-pop text-md text-grey">{(user as any).email}</p>
        <p className="font-pop text-grey text-md mb-4">
          {(user as any).description}
        </p>

        {(user as any).website && (
          <a
            className="font-pop text-grey text-md cursor-pointer flex flex-row gap-3 items-center"
            href={(user as any).website}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGlobe className="text-grey" size={18} /> {(user as any).website}
          </a>
        )}

        <div className="flex flex-row gap-3">
          {(user as any).twitter && (
            <a
              className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center"
              href={`https://twitter.com/${(user as any).twitter}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaTwitter className="text-grey" size={18} />{" "}
              {(user as any).twitter}
            </a>
          )}
          {(user as any).discord && (
            <span className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center">
              <FaDiscord className="text-grey" size={18} />{" "}
              {(user as any).discord}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-row justify-center w-full flex-wrap sm:gap-3 gap-3 mx-auto">
          {currentItems.map((file) => (
            <div
              key={`file-${user.id}-${file.name}`}
              className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center sm:w-fit w-[48%] p-4 border-1.5 border-[#242424] rounded-2xl"
              role="button"
              tabIndex={0}
              onClick={() => openModal(file)}
              onKeyDown={(e) => handleKeyDown(e, file)}
            >
              <div className="sm:p-2 p-1">{renderFilePreview(file)}</div>
              <p className="text-foreground font-pop font-medium truncate w-[300px] text-center sm:text-md text-md mt-2">
                {file.description}
              </p>
            </div>
          ))}
        </div>

        {files.length > FILES_PER_PAGE && (
          <div className="flex justify-center mt-6 gap-2">
            <Button
              aria-label="Previous page"
              className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <IoIosArrowRoundBack className="text-2xl" />
            </Button>

            {Array.from(
              { length: Math.ceil(files.length / FILES_PER_PAGE) },
              (_, i) => (
                <Button
                  key={i}
                  aria-label={`Go to page ${i + 1}`}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === i + 1
                      ? "bg-[#9564b4] text-white"
                      : "bg-black text-white hover:bg-[#333333]"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ),
            )}

            <Button
              aria-label="Next page"
              className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
              disabled={
                currentPage === Math.ceil(files.length / FILES_PER_PAGE)
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(Math.ceil(files.length / FILES_PER_PAGE), prev + 1),
                )
              }
            >
              <IoIosArrowRoundForward className="text-2xl" />
            </Button>
          </div>
        )}

        {modalOpen && selectedItem && (
          <div
            aria-labelledby="modal-title"
            aria-modal="true"
            className="fixed inset-0 bg-background bg-opacity-80 flex items-center justify-center z-50 p-6"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="bg-background border-1.5 border-[#242424] sm:p-5 p-2 rounded-xl max-w-5xl w-fit flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-end">
                <button
                  aria-label="Close modal"
                  className="mb-2 text-2xl cursor-pointer hover:text-grey"
                  onClick={closeModal}
                >
                  <IoIosCloseCircle />
                </button>
              </div>
              {selectedItem.fileType?.startsWith("video/") ? (
                <video
                  autoPlay
                  controls
                  className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                >
                  <source
                    src={`${CDNURL}${user?.id}/${selectedItem.name}`}
                    type={selectedItem.fileType}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : selectedItem.fileType?.startsWith("image/") ? (
                <Image
                  alt={selectedItem.description || "User uploaded image"}
                  className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                  height={700}
                  priority={true}
                  src={`${CDNURL}${user?.id}/${selectedItem.name}`}
                  unoptimized
                  width={700}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-[400px] bg-[#1c1c1c] rounded-xl">
                  <p className="text-white text-lg">
                    File: {selectedItem.name}
                  </p>
                </div>
              )}
              <p
                className="text-foreground font-medium text-center sm:text-md text-sm font-pop mb-1 mt-4"
                id="modal-title"
              >
                {selectedItem.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
