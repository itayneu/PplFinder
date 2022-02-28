import { useState, useEffect } from "react";
import axios from "axios";

export const usePeopleFetch = (pageNumber) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pageNumber]);

  async function fetchUsers() {
    setIsLoading(true);
    const response = await axios.get(`https://randomuser.me/api/?results=25&page=${pageNumber}`);
    setIsLoading(false);
    setHasMore(response.data.results.length > 0);
    setUsers((prevUsers) => {
      return [...new Set([...prevUsers, ...response.data.results])]
    });
  }

  return { users, isLoading, hasMore, fetchUsers };
};
