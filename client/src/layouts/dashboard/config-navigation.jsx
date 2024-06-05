import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'News',
    path: '/',
    icon: icon('ic_user'),
  },
  {
    title: 'Project',
    path: '/project',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Blockchain',
    path: '/blockchain',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
