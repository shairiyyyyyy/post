import React, { useState, useEffect, useCallback } from "react";
import uniqid from "uniqid";
import { useSelector, useDispatch } from "react-redux";
import { addComments, getPostComment } from "../Redux/Action";
import SingleComments from "./Single-comments";
import { getPost } from "../Services/Services";
import { showError, hideLoading, showLoading, clearError } from "../Redux/Action";
import Loading from "./Loading";

const Comments = () => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.CommentReducer);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uniqid();
    dispatch(addComments(input, id));
    setInput("");
  }
  const loaPost = useCallback(async () => {
    dispatch(showLoading())
    dispatch(clearError())
    try {
      const data = await getPost()
      console.log("data>>>", data)
      dispatch(getPostComment(data.data))
    } catch (error) {
      dispatch(showError("что то пашло не так"))
    } finally {
      dispatch(hideLoading())
    }
  }, [])
  useEffect(() => {
    loaPost()
  }, [])
  if (loading) {
    return <Loading />
  }
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={loaPost}>повторить</button>
      </div>
    )
  }

  return (
    <div className="card-comments">
      <form onSubmit={handleSubmit}>

        <div className="comments-item">
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="comment"
            value={input}
          />
          <input type="submit" hidden />
        </div>
      </form>
      {
        comments.map((elem) => {
          return <SingleComments key={elem.id} {...elem} />
        })

      }
    </div>
  );
};

export default Comments;

