import { BrowserRouter } from "react-router-dom";
import ApplicationRoutes from "./ui/routes";
import "./App.css";
import { GraphQLClient, ClientContext } from "graphql-hooks";
const client = new GraphQLClient({
  url: "http://smart-meeting.herokuapp.com",
});

function App() {
  return (
    <ClientContext.Provider value={client}>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </ClientContext.Provider>
  );
}

export default App;
