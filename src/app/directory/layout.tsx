import SearchBar from "@/components/SearchBar";

interface BusinessLayout {
  children: React.ReactNode;
}

const layout = ({ children }: BusinessLayout) => {
  return (
    <main>
      <SearchBar />
      {children}
    </main>
  );
};

// export const revalidate = 0;

export default layout;
