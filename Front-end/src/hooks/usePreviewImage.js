import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";

function usePreviewImage() {
    const toast = useToast();
    const [image, setimage] = useState(null);
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setimage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            toast({
                title: "error",
                description: "invalid file type",
                status: "error",
                duration: 3000,
            });
            setimage(null);
        }
    };
    return { handleImage, image, setimage };
}

export { usePreviewImage };