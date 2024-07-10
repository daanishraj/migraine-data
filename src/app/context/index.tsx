"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import supabase from "../../../supabase";
import Landing from "@/components/Landing";
import Header from "@/components/Header";

interface AuthContextType {
  user: any;
  setUser : (user: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}
});

export const AuthContextProvider = ({
  children,
  switchTheme,
}: {
  children: ReactNode;
  switchTheme: any;
}) => {
  const [user, setUser] = useState<any>(false);

  const onAuthStateChange = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChange();
  }, []);

  const value = useMemo(() => {
    console.log('reset user value')
    return {
      user,
      setUser
    };
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      <Header switchTheme={switchTheme} />
      {user ? children : <Landing />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { user, setUser } = useContext(AuthContext);
  return { user, setUser };
};
