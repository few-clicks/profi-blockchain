import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
  };

  return (
    <LoadingButton
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      color="inherit"
      onClick={handleClick}
    >
      Login
    </LoadingButton>
  );
}
