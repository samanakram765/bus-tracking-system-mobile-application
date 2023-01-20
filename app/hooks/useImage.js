import { useState } from "react";

export const useImage = () => {
  const [imageUri, setImageUri] = useState("");

  const imageSet = (image) => setImageUri(image);

  return { imageUri, imageSet };
};
