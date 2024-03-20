
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Search from './Search';
import axios from 'axios';
import Footer from './Footer';
const Home = ({ userInfo, isLoggedIn }) => {
//initialize all the usestates
  const [searchResults, setSearchResults] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [publicLists, setPublicLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [expandedHeroInfo, setExpandedHeroInfo] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedListForReview, setSelectedListForReview] = useState(null);
  const [review, setReview] = useState({
    rating: '',
    comment: '',
  });
  const [areResultsHidden, setAreResultsHidden] = useState(false);
  //function for closing the review model
  const closeReviewModal = () => {
    setReviewModalOpen(false); //sets the review modal open to false
  };
  const handleToggleResultsVisibility = () => { //function for handline search results visibility
    setAreResultsHidden(!areResultsHidden); //sets it to the oppposite of whatever results is currently set to
  };
  const fetchPublicLists = async () => {
    try {
      const response = await axios.get('/public-hero-lists'); //call the public hero lists api
      // Sort the publicLists by lastModified in descending order
      const sortedLists = response.data.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  
      // Fetch reviews for each list
      const listsWithReviews = await Promise.all(sortedLists.map(async (list) => { //map the reviews to the sorted list
        const reviewsResponse = await axios.get(`/reviews/${list.name}`); //send the listname as a part of the query
        const reviews = reviewsResponse.data; // Assuming the API returns an array of reviews
  
        return { //return the list and reviews
          ...list,
          reviews,
        };
      }));
  
      setPublicLists(listsWithReviews);
    } catch (error) { //error handling
      console.error('Error fetching public hero lists:', error);
    }
  };

  useEffect(() => {
    // Fetch public hero lists when the component mounts
    fetchPublicLists();
    
  }, []);

  const fetchHeroInfoById = async (superheroId) => { //function used to fetch a hero by id
    try {
      const response = await axios.get(`/api/superheroinfo/${superheroId}`); //cal the api for fetching a superhero by id
      setExpandedHeroInfo(response.data); //set the expanded hero info part of the table to the response data
    } catch (error) {
      console.error('Error fetching superhero information:', error);
    }
  };

  const handleExpandToggle = async (listId, superheroId) => { //function to handle the expand button toggle
    setSelectedListId(selectedListId === listId ? null : listId);
    if (selectedListId !== listId) {
      // Fetch superhero information only if expanding the row
      await fetchHeroInfoById(superheroId);
    } else {
      setExpandedHeroInfo(null);
    }
  };

  const handleAddReviewClick = (list) => { //function for handling the add review click
    setSelectedListForReview(list); //set the selected list for review
    setReviewModalOpen(true); //open the review modal
  };

  const handlePostReview = async () => {
    const isConfirmed = window.confirm('Are you sure you want to post this review?'); //ask the user to confirm the review before posting
  
    if (!isConfirmed) {
      return; //return if the user does not confirm
    }
  
    try {
      const response = await axios.post('/add-review', { //call the add review api and send all the review info
        listName: selectedListForReview.name,
        rating: review.rating,
        comment: review.comment,
        reviewer_email: userInfo.email,
      });
  
      if (response.data.success) {
        setReviewModalOpen(false); //close the review modal after success
      } else {
        console.error('Error posting review:', response.data.message);
      }
    } catch (error) { //error handling
      console.error('Error posting review:', error);
    }
  };

  const handleSearch = async (searchParams) => {
    // check if all search parameters are empty
    const allSearchBoxesEmpty = Object.values(searchParams).every((value) => value === '');
  
    if (allSearchBoxesEmpty) {
      // show an alert and return early
      alert('Please enter at least one value in the search boxes.');
      return;
    }
  
    try {

      // make a request to /search API
      const response = await axios.get('/api/superheroinfo/search', { params: searchParams });
  
      // update the state with the received search results
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching superheroes:', error);
    }
  };

  const toggleExpand = (rowId) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const searchOnDDG = (heroName, publisher) => {
    // open a new browser tab for DDG search with the hero's name and publisher
    window.open(`https://duckduckgo.com/?q=${heroName} ${publisher}`, '_blank');
    };

  const calculateAverageRating = (reviews) => { //function for calculating the average rating of a list
    if (reviews.length === 0) { //if no reviews then just the average rating to n/a
      return 'N/A';
    }
  
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0); //calculate the total of all teh reviews
    const averageRating = totalRating / reviews.length; //divide by the length
    return averageRating.toFixed(1); // print to one decimal place
  };
  const handleRefreshPublicLists = () => {
    // Call the fetchPublicLists function to refresh the public lists
    fetchPublicLists();
  };
  return (
    <div id="home-container">
      <nav id="main-nav">
        <NavLink to="/">
            <button>
              Home
            </button>
          </NavLink>
        <NavLink to="/Login">
          <button style={{ marginRight: '10px' }}>
            Login
          </button>
        </NavLink>
      </nav>
      <h1>SuperHero Central</h1>
      <p>This site allows you to search and find a great many lists of superheroes. Test it out by searching yourself! See the public lists of superheroes made by our users. Register Today!</p>

      

      <Search onSearch={handleSearch} />

      <div>
        <h2>Search Results
        <button onClick={handleToggleResultsVisibility}>
            {areResultsHidden ? 'Unhide' : 'Hide'} Results
          </button>
        </h2>
        {!areResultsHidden && (
        <table className="superhero-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Publisher</th>
              <th>Expand</th>
              <th>Search on DDG</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result) => (
              <React.Fragment key={result.id}>
                <tr>
                  <td>{result.name}</td>
                  <td>{result.Publisher}</td>
                  <td>
                    <button onClick={() => toggleExpand(result.id)}>
                      {expandedRowId === result.id ? 'Collapse' : 'Expand'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => searchOnDDG(result.name, result.Publisher)}>
                      Search on DDG
                    </button>
                  </td>
                </tr>
                {expandedRowId === result.id && (
                  <tr>
                    <td colSpan="4">
                      ID: {result.id}<br />
                      Gender: {result.Gender}<br />
                      Eye Color: {result['Eye color']}<br />
                      Race: {result.Race}<br />
                      Hair Color: {result['Hair color']}<br />
                      Height: {result.Height}<br />
                      Skin Color: {result['Skin color']}<br />
                      Alignment: {result.Alignment}<br />
                      Weight: {result.Weight}<br />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div>
        <h2>Public Lists
        <button onClick={handleRefreshPublicLists}>
            Refresh
          </button>
        </h2>
        <table className="superhero-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Creator</th>
              <th>Heroes Count</th>
              <th>Average Rating</th>
              
              <th>Expand</th>
              <th>Reviews</th> 
              {isLoggedIn && <th>Add Review</th>}
            </tr>
          </thead>
          <tbody>
            {publicLists.slice(0, 10).map((list) => (
              <React.Fragment key={list.name}>
                <tr>
                  <td>{list.name}</td>
                  <td>{list.creatorNickname}</td>
                  <td>{list.superHeros.split(',').length}</td>
                  <td>{calculateAverageRating(list.reviews)}</td>
                  
                  <td>
                    <button onClick={() => handleExpandToggle(list.name, list.superHeros)}>
                      {selectedListId === list.name ? 'Collapse' : 'Expand'}
                    </button>
                  </td>
                  <td>
                    {list.reviews && list.reviews.map((review) => (
                      <div key={review.id}>
                        <p>
                          <strong>Rating:</strong> {review.rating} | <strong>Comment:</strong> {review.comment}
                        </p>
                      </div>
                    ))}
                  </td>
                  {isLoggedIn && (
                    <td>
                      <button onClick={() => handleAddReviewClick(list)}>Add Review</button>
                    </td>
                  )}
                </tr>
                {selectedListId === list.name && (
                  <tr>
                    <td colSpan="6">
                      {expandedHeroInfo && (
                        <>
                          <p>Description: {list.description}</p>
                          <p>List of Heroes:</p>
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Powers</th>
                                <th>Publisher</th>
                                <th>Expand</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expandedHeroInfo.map((hero) => (
                                <React.Fragment key={hero.id}>
                                  <tr>
                                    <td>{hero.name}</td>
                                    <td>{hero.powers.join(', ')}</td>
                                    <td>{hero.Publisher}</td>
                                    <td>
                                      <button onClick={() => toggleExpand(hero.id)}>
                                        {expandedRowId === hero.id ? 'Collapse' : 'Expand'}
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedRowId === hero.id && (
                                    <tr>
                                      <td colSpan="4">
                                        <strong>ID:</strong> {hero.id}<br />
                                        <strong>Gender:</strong> {hero.Gender}<br />
                                        <strong>Eye Color:</strong> {hero['Eye color']}<br />
                                        <strong>Race:</strong> {hero.Race}<br />
                                        <strong>Hair color:</strong> {hero['Hair color']}<br />
                                        <strong>Height:</strong> {hero.Height}<br />
                                        <strong>Skin Color:</strong> {hero['Skin color']}<br />
                                        <strong>Alignment:</strong> {hero.Alignment}<br />
                                        <strong>Weight:</strong> {hero.Weight}<br />
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {reviewModalOpen && (
        <div className="overlay">
          <div className="modal-content">
          
            <h2>Add Review</h2>
            <label>
              Rating:
              <input
                type="number"
                name="rating"
                value={review.rating}
                onChange={(e) => {
                  const ratingValue = parseInt(e.target.value, 10);
                  if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 10) {
                    setReview({ ...review, rating: ratingValue });
                  }
                }}
                min="1"
                max="10"
                required
              />
            </label>
            <br />
            <label>
              Comment (optional):
              <input
                type="text"
                name="comment"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
              />
            </label>
            <br/>
            <button onClick={closeReviewModal}>Cancel</button>

            <button onClick={handlePostReview}>Post Review</button>
          </div>
        </div>
      )}
       <Footer />
    </div>

  );
};
export default Home;