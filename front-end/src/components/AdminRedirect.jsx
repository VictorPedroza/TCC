import { useEffect } from 'react';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'http://localhost/TCC/view/TelaloginUser.php';
  }, []);

  return null;
};

export default AdminRedirect;
