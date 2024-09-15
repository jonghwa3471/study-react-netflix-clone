import { useQuery } from "react-query";
import {
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
  getTvTrending,
  IGetTvResult,
  ITv,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  background-color: #131313;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 180px;
  margin-bottom: 10vh;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 30px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center;
  height: 150px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{ $scrollY: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.$scrollY + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 45vh;
  background-size: cover;
  background-position: center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 28px;
  position: relative;
  bottom: 80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  bottom: 80px;
`;

const SliderTitle = styled.div`
  padding-left: 30px;
  font-size: 24px;
`;

const RowBtn = styled.div`
  position: absolute;
  font-size: 24px;
  top: 50%;
  right: 0;
  padding-right: 5px;
  &:hover {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s ease-in-out;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useScroll();
  const useMultipleQuery = () => {
    const trending = useQuery<IGetTvResult>(["tv", "trending"], getTvTrending);
    const airingToday = useQuery<IGetTvResult>(
      ["tv", "airingToday"],
      getTvAiringToday
    );
    const popular = useQuery<IGetTvResult>(["tv", "popular"], getTvPopular);
    const topRated = useQuery<IGetTvResult>(["tv", "topRated"], getTvTopRated);
    return [trending, airingToday, popular, topRated];
  };

  const [
    { isLoading: loadingTrending, data: trendingData },
    { isLoading: loadingAiringToday, data: airingTodayData },
    { isLoading: loadingPopular, data: popularData },
    { isLoading: loadingTopRated, data: topRatedData },
  ] = useMultipleQuery();

  const [trendingIndex, setTrendingIndex] = useState(0);
  const [airingTodayIndex, setAiringTodayIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseTrendingIndex = () => {
    if (trendingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = trendingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTrendingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseAiringTodayIndex = () => {
    if (airingTodayData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = airingTodayData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setAiringTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increasePopularIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popularData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseTopRatedIndex = () => {
    if (topRatedData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRatedData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const getWindowDimensions = () => {
    const { innerWidth } = window;
    return innerWidth;
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const onBoxClicked = (tvId: string) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedMovie =
    bigMovieMatch?.params.tvId &&
    (trendingData?.results.find(
      (tv: ITv) => String(tv.id) === bigMovieMatch.params.tvId.split("_")[1]
    ) ||
      airingTodayData?.results.find(
        (tv: ITv) => String(tv.id) === bigMovieMatch.params.tvId.split("_")[1]
      ) ||
      popularData?.results.find(
        (tv: ITv) => String(tv.id) === bigMovieMatch.params.tvId.split("_")[1]
      ) ||
      topRatedData?.results.find(
        (tv: ITv) => String(tv.id) === bigMovieMatch.params.tvId.split("_")[1]
      ));
  return (
    <Wrapper>
      {loadingTrending ||
      loadingAiringToday ||
      loadingPopular ||
      loadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              trendingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{trendingData?.results[0].name}</Title>
            <Overview>{trendingData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>
              <span>Trending</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={trendingIndex}
              >
                {trendingData?.results
                  .slice(1)
                  .slice(
                    offset * trendingIndex,
                    offset * trendingIndex + offset
                  )
                  .map((tv: ITv) => (
                    <Box
                      layoutId={`trending_${tv.id}`}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`trending_${tv.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseTrendingIndex}>
              <span>＞</span>
            </RowBtn>
          </Slider>
          <Slider>
            <SliderTitle>
              <span>Airing Today</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={airingTodayIndex}
              >
                {airingTodayData?.results
                  .slice(1)
                  .slice(
                    offset * airingTodayIndex,
                    offset * airingTodayIndex + offset
                  )
                  .map((tv: ITv) => (
                    <Box
                      layoutId={`airingToday_${tv.id}`}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`airingToday_${tv.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseAiringTodayIndex}>
              <span>＞</span>
            </RowBtn>
          </Slider>
          <Slider>
            <SliderTitle>
              <span>Popular</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((tv: ITv) => (
                    <Box
                      layoutId={`popular_${tv.id}`}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`popular_${tv.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increasePopularIndex}>
              <span>＞</span>
            </RowBtn>
          </Slider>
          <Slider>
            <SliderTitle>
              <span>Top Rated</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedData?.results
                  .slice(1)
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((tv: ITv) => (
                    <Box
                      layoutId={`topRated_${tv.id}`}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`topRated_${tv.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseTopRatedIndex}>
              <span>＞</span>
            </RowBtn>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  $scrollY={scrollY.get()}
                  layoutId={bigMovieMatch.params.tvId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
