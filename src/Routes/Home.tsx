import { useQuery } from "react-query";
import {
  getLatest,
  getTopRated,
  getUpcoming,
  IGetMoviesResult,
  IMovie,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

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

/* const rowVariants = {
  hidden: {
    x: window.outerWidth - 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 10,
  },
}; */

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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();
  const useMultipleQuery = () => {
    const latest = useQuery<IGetMoviesResult>(["movies", "latest"], getLatest);
    const topRated = useQuery<IGetMoviesResult>(
      ["movies", "topRated"],
      getTopRated
    );
    const upComing = useQuery(["movies", "upComing"], getUpcoming);
    return [latest, topRated, upComing];
  };
  const [
    { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComing, data: upComingData },
  ] = useMultipleQuery();
  const [latestIndex, setLatestIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [upComingIndex, setUpComingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseLatestIndex = () => {
    if (latestData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = latestData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setLatestIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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
  const increaseUpComingIndex = () => {
    if (upComingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upComingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpComingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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
  const onBoxClicked = (movieId: string) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (latestData?.results.find(
      (movie: IMovie) =>
        String(movie.id) === bigMovieMatch.params.movieId.split("_")[1]
    ) ||
      topRatedData?.results.find(
        (movie: IMovie) =>
          String(movie.id) === bigMovieMatch.params.movieId.split("_")[1]
      ) ||
      upComingData?.results.find(
        (movie: IMovie) =>
          String(movie.id) === bigMovieMatch.params.movieId.split("_")[1]
      ));
  return (
    <Wrapper>
      {loadingLatest || loadingTopRated || loadingUpComing ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(latestData?.results[0].backdrop_path || "")}
          >
            <Title>{latestData?.results[0].title}</Title>
            <Overview>{latestData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>
              <span>Now Playing</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={latestIndex}
              >
                {latestData?.results
                  .slice(1)
                  .slice(offset * latestIndex, offset * latestIndex + offset)
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={`nowPlaying_${movie.id}`}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`nowPlaying_${movie.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseLatestIndex}>
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
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={`topRated_${movie.id}`}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`topRated_${movie.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseTopRatedIndex}>
              <span>＞</span>
            </RowBtn>
          </Slider>
          <Slider>
            <SliderTitle>
              <span>Up Coming</span>
            </SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // variants={rowVariants}
                initial={{ x: windowDimensions - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -windowDimensions + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={upComingIndex}
              >
                {upComingData?.results
                  .slice(1)
                  .slice(
                    offset * upComingIndex,
                    offset * upComingIndex + offset
                  )
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={`upComing_${movie.id}`}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(`upComing_${movie.id}`)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <RowBtn onClick={increaseUpComingIndex}>
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
                  layoutId={bigMovieMatch.params.movieId}
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
                      <BigTitle>{clickedMovie.title}</BigTitle>
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

export default Home;
