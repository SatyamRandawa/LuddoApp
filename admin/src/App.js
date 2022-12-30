import { Routes, Route } from "react-router-dom"
import Home from './Home';
import Login from './Login';
import Admin from './adminManagement/adminList'
import Game_rooms from './adminManagement/Game_rooms'
import CreateAdmin from './adminManagement/CreateAdmin'
import UpdateAdmin from './adminManagement/UpdateAdmin'
import ChangePassword from './ProfileManagement/ChangePassword'

function App() {

  return (
    <> 

     <Routes>

      {/* Dashboard/Login */}
        <Route path="/" element={ <Login/> } />
        <Route path="/admin" element={ <Admin/>}/>
        <Route path="/game_rooms" element={<Game_rooms/>}/>
        <Route path="/admin/create" element={ <CreateAdmin/>}/>
        <Route path="/admin/update/:id" element={ <UpdateAdmin/>}/>
        <Route path="/changepassword" element={ <ChangePassword/>}/>
      </Routes>
    </>
  );
}

export default App
