import React, { useCallback, useContext, useEffect, useState } from "react";
import { LinksList } from "../components/LinksList";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

export const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const { request, loading } = useHttp();
  const { token } = useContext(AuthContext);

  const linksLoader = useCallback(async () => {
    try {
      const response = await request(`/api/link`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });

      setLinks(response);
    } catch (error) {}
  }, [request, token]);

  useEffect(() => {
    linksLoader();
  }, [linksLoader]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && <LinksList links={links} />}</>;
};
