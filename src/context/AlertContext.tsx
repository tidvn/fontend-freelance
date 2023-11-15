import { userStore } from "@/store/user";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AlertContextType = {
  showAlert: ({status, variant, message}:any) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {

  const { data: session, status }: any = useSession();
  const { userInfo, fetchData }: any = userStore();
  
  useEffect(() => {
    if (session?.accessToken) {   
      fetchData(session?.accessToken);
    }
  }, [session]);
  
  const [isVisible, setIsVisible] = useState(false);
  const [arlertData, setArlertData] = useState<any>({
    status: "",
    variant: "",
    message: "",
  });

  const showAlert = ({status, variant, message}:any) => {
    setArlertData({
      status: status,
      variant: variant,
      message: message,
    });
    setIsVisible(true);
  };

  const hideAlert = () => {
    setArlertData({
      status: '',
      variant: '',
      message: '',
    });
    setIsVisible(false);
  };
  const alertStyle:React.CSSProperties = {
    position: "fixed",
    top: "80px", // Điều chỉnh top để điều chỉnh vị trí theo yêu cầu của bạn
    right: "40px", // Điều chỉnh right để điều chỉnh vị trí theo yêu cầu của bạn
    zIndex: 1000, // Để đảm bảo thông báo hiển thị trên các thành phần khác
  };
  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {isVisible && (
        <div style={alertStyle}>
          <Alert status={arlertData.status} variant={arlertData.variant}>
            <AlertIcon />
            <Box>
              <AlertDescription>{arlertData.message}</AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={hideAlert}
            />
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  );
};
