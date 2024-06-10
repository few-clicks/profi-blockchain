import { Helmet } from 'react-helmet-async';
import ProjectView from './ProjectView';

// ----------------------------------------------------------------------

export default function Project() {
  return (
    <>
      <Helmet>
        <title> Blockchain </title>
      </Helmet>

      <ProjectView />
    </>
  );
}
