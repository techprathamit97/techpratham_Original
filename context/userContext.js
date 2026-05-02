"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccountant, setIsAccountant] = useState(false);
  const [userData, setUserData] = useState({});

  // dashboard tabs
  const [currentTab, setCurrentTab] = useState("profile");
  const [activeUserTab, setActiveUserTab] = useState("");
  const [userSideBar, setUserSideBar] = useState(false);
  const [adminSideBar, setAdminSideBar] = useState(false);

  const { data: session } = useSession();
  const user = session?.user?.email || null;

  const yearData = new Date();
  let currentYear = yearData.getFullYear();

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      setAuthenticated(false);
      setIsAdmin(false);
      setIsAccountant(false);
      setUserData({});
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/email?email=${user}`);
      if (!res.ok) {
        // If user not found in DB but session exists
        if (res.status === 404) {
          console.error("User not found in database.");
          setAuthenticated(false);
          setIsAdmin(false);
          setIsAccountant(false);
          setUserData({});
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch user details");
      }

      const fetchedUserData = await res.json();
      setUserData(fetchedUserData);
      setAuthenticated(true);

      setIsAdmin(fetchedUserData?.role?.type === "admin");
      setIsAccountant(fetchedUserData?.role?.type === "accountant");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthenticated(false);
      setIsAdmin(false);
      setIsAccountant(false);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const refreshUserData = () => {
    fetchUserData();
  };

  const checkAdminAccess = () => {
    return userData?.role?.type === "admin";
  };

  const checkAccountantAccess = () => {
    return userData?.role?.type === "accountant" || userData?.role?.type === "admin";
  };

  const getUserRole = () => {
    return {
      type: userData?.role?.type || "user",
      position: userData?.role?.position || "",
    };
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        setLoading,
        activeTab,
        setActiveTab,
        authenticated,
        setAuthenticated,
        userData,
        currentYear,
        refreshUserData,
        currentTab,
        setCurrentTab,
        isAdmin,
        isAccountant,
        checkAdminAccess,
        checkAccountantAccess,
        getUserRole,
        activeUserTab,
        setActiveUserTab,
        userSideBar,
        setUserSideBar,
        adminSideBar,
        setAdminSideBar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
