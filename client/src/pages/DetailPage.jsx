import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LinkCard } from "../components/LinkCard";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

export const DetailPage = () => {
  const { request, loading } = useHttp();
  const [link, setLink] = useState(null);
  const { token } = useContext(AuthContext);
  const linkId = useParams().id;

  const getLink = useCallback(async () => {
    try {
      const response = await request(`/api/link/${linkId}`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setLink(response);
    } catch (error) {}
  }, [token, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);

  if(loading) {
    return <Loader />
  }

  return (
    <>
      {!loading && link && <LinkCard link={link} />}
    </>
  );
};
