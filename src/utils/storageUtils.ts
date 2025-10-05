
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseUtils";

export const uploadFile = async (file: File, folder: string = 'events'): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${file.name}`);
  
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
