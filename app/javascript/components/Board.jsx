import React from 'react'
import SideBar from './Sidebar'
import UserCard from './Users/UsersCard'
import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://127.0.0.1:3000/";

function Board({db}) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState();
  const [page, setPage] = useState(0);

  //const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      //abortControllerRef.current?.abort();
      //abortControllerRef.current = new AbortController();

      setIsLoading(true);
      
      try {
        const response = await fetch(`${BASE_URL}test/${db.board.id}`);
        //  , {
        //  signal: abortControllerRef.current?.signal,
        //});
        const member = (await response.json());
        setMember(member);
      } catch (e) {
        console.log({e})
        if (e.name === "AbortError") {
          console.log("Aborted");
          return;
        }

        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [page]);

  

  if (error) {
    console.log(error.failures)
    if (error.name === "NotFound") {
      return <div>Board not found</div>
    }
    return <div>Something went wrong! Please try again.</div>;
  }

  console.log(member)

  return (
    <>
      {isLoading && <div>Loading...</div>}
      <UserCard members={db.members}/>
      <h1>Board</h1>
    </>
  )
}

export default Board