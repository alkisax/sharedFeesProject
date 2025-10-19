// sharedfees-native\context\variablesContext.tsx

import { createContext, useContext } from 'react';

type VariablesContextType = {
  url: string
};

// εδώ κάνουμε initiate το context. Του δείνουμε μια αρχική τιμή για type safety
// Ο variablesContext καλείτε απο τον provider για να διαμυραστεί στα components
const VariablesContext = createContext<VariablesContextType>({ 
  url: ''
});

export const VariablesProvider = ({ children }: { children: React.ReactNode }) => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL!;
  
  return (
    <VariablesContext.Provider value={{ url }}>
      {children}
    </VariablesContext.Provider>
  );
};

// εδω φτιαξαμε ένα hook και το καλούμε με 
// const { url } = useVariables();
// χωρίς αυτό θα το καλούσαμε με const { url } = useContext(VariablesContext);
export const useVariables = () => useContext(VariablesContext);
