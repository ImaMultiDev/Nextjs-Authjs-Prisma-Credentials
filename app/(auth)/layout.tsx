const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid place-content-center place-items-center min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
