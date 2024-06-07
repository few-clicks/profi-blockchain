import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Project',
    path: '/',
    icon: icon('ic_user'),
  },
  {
    title: 'Info',
    path: '/info',
    icon: icon('ic_analytics'),
  },
  {
    title: 'News',
    path: '/news',
    icon: icon('ic_blog'),
  },
  {
    title: 'Blockchain',
    path: '/blockchain',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
