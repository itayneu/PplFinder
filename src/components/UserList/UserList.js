import React, { useState, useRef, useCallback } from "react";
import { findIndex } from "lodash-es";
import Text from "components/Text";
import Button from "components/Button";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import RadioButtonsGroup from "components/RadioButtonsGroup";
import { useLocation } from "hooks";
import { useLocalStorage } from "hooks";
import IconButton from "@material-ui/core/IconButton";
import LocationOn from "@material-ui/icons/LocationOn";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as S from "./style";

const UserList = ({ page, users, isLoading, hasMore, setPageNumber }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [activeFilters, setActiveFilters] = useState([]);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const { lat, long, getLocation, measureDistance } = useLocation();
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const observer = useRef();
  const lastUserElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);
  
  const filters = [
    {"value":"BR", "label":"Brazil"},
    {"value":"AU", "label":"Australia"},
    {"value":"CA", "label":"Canada"},
    {"value":"DE", "label":"Germany"},
    {"value":"FI", "label":"Finland"}
  ];
  const distanceUnits = [
    {"value":"km", "label":"km"},
    {"value":"mi", "label":"mi"}
  ];

  let prevLat = null;
  let prevLong = null;

  function handleGetLocation() {
    prevLat = lat;
    prevLong = long;
    getLocation();
    if (prevLat === lat && prevLong === long && prevLat !== null && prevLong !== null) toast("Your location hasn't changed");
  };

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  const handleActiveFilters = (value) => {
    const currentIndex = activeFilters.indexOf(value);
    const newActiveFilters = [...activeFilters];

    if (currentIndex !== -1) {
      newActiveFilters.splice(currentIndex, 1);
    } else {
      newActiveFilters.push(value);
    }

    setActiveFilters(newActiveFilters);
  };

  const handleFavorites = (user, userFavoritesIndex) => {
    const newFavorites = [...favorites];

    if (userFavoritesIndex !== -1) {
      newFavorites.splice(userFavoritesIndex, 1);
    } else {
      newFavorites.push(user);
    }

    setFavorites(newFavorites);
  };

  const renderLocation = (userLat, userLong) => {
    if (lat !== null && long !== null) {
      return (
        <div>
          <LocationOn fontSize="small"/>
          {measureDistance(lat, long, userLat, userLong, distanceUnit).toFixed(0)} {distanceUnit} from you
        </div>
      );
    }
  }

  const renderDistanceUnits = () => {
    if (lat !== null && long !== null) {
      return (
        <S.RadioButtonsGroup>
          <RadioButtonsGroup onChange={setDistanceUnit} value={distanceUnit} radioButtons={distanceUnits} />
        </S.RadioButtonsGroup>
      );
    }
  }

  return (
    <S.UserList>
      <ToastContainer position="top-center" hideProgressBar={true} />
      <S.Filters>
        {filters.map((filter) => {
          return (
            <CheckBox onChange={() => handleActiveFilters(filter.value)} value={filter.value} label={filter.label} />
          );
        })}
      </S.Filters>
      <S.Button>
        <Button label="show distance from your location" variant="contained" onClick={handleGetLocation}/>
      </S.Button>
      {renderDistanceUnits()}
      
      <S.List>
        {users?.map((user, index) => {
          const userFavoritesIndex = findIndex(favorites, user);
          if ((page === "home" || (page === "favorites" && userFavoritesIndex !== -1)) && (activeFilters.length === 0 || activeFilters.includes(user?.nat))) {
            return (
              <S.User
                ref={(users.length === index + 1) ? lastUserElementRef: undefined}
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <S.UserPicture src={user?.picture.large} alt="" />
                <S.UserInfo>
                  <Text size="22px" bold>
                    {user?.name.title} {user?.name.first} {user?.name.last} 
                  </Text>
                  <Text size="14px">{user?.email}</Text>
                  <Text size="14px">
                    {user?.location.street.number} {user?.location.street.name} 
                  </Text>
                  <Text size="14px">
                    {user?.location.city} {user?.location.country}
                  </Text>
                  <Text size="16px" bold>
                    {renderLocation(user?.location.coordinates.latitude, user?.location.coordinates.longitude)} 
                  </Text>
                </S.UserInfo>
                <S.IconButtonWrapper isVisible={index === hoveredUserId || userFavoritesIndex !== -1}>
                  <IconButton onClick={() => handleFavorites(user, userFavoritesIndex)}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
              </S.User>
            );
          }
        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;
