import React from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import * as S from "./style";

const Favorites = () => {
  const favoriteUsers = JSON.parse(localStorage.getItem('favorites'));

  return (
    <S.Favorites>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            Favorites
          </Text>
        </S.Header>
        <UserList page="favorites" users={favoriteUsers} />
      </S.Content>
    </S.Favorites>
  );
};

export default Favorites;
