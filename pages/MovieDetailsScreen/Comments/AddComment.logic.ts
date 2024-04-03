import { addComment } from "firebase/services";
import React, { useState } from "react";
import { CommentType } from "static/types";

const useAddComment = () => {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAddComment(movieId: string, comment: CommentType) {
    try {
      setLoading(true);
      const commentAdded = await addComment(movieId, comment);
      setLoading(false);

      return commentAdded;
    } catch (error) {
      console.log(error);
    }
  }
  return {
    loading,
    handleAddComment,
  };
};

export default useAddComment;
