import React from "react";
import ImageView from "react-native-image-viewing";

const ImageViewScreen = ({ hideModal, visible, imageUri }) => {
  if (!imageUri) return null;

  return (
    <ImageView
      images={[
        {
          uri: imageUri,
        },
      ]}
      visible={visible}
      onRequestClose={hideModal}
    />
  );
};

export default ImageViewScreen;
