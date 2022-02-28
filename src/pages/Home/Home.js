import React, { useState } from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import { usePeopleFetch } from "hooks";
import * as S from "./style";

const Home = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { users, isLoading, hasMore } = usePeopleFetch(pageNumber);

  return (
    <S.Home>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            PplFinder
          </Text>
        </S.Header>
        <UserList page="home" users={users} isLoading={isLoading} hasMore={hasMore} setPageNumber={setPageNumber} />
      </S.Content>
    </S.Home>
  );
};

export default Home;
