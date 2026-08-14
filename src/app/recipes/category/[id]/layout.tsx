type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

const CategoryLayout = ({ children }: Props) => <>{children}</>;

export default CategoryLayout;
