import Header from "@/app/components/Header";
import Items from "@/app/components/Home/Items";
import {
  SearchItemContext,
  SearchItemProvider,
} from "@/app/components/context/SearchtemContext";

const HomeItems = () => {
  return (
    <div>
      <SearchItemProvider>
        <Header type="Items" />
        <Items />
      </SearchItemProvider>
    </div>
  );
};

export default HomeItems;
