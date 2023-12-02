import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { setSingleObject } from './store/actions';
import Popup from './popup';
import { type } from '@testing-library/user-event/dist/type';

const TableView = ({ setSingleObject }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [filter,setfilter]=useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.punkapi.com/v2/beers?${filter}`);
        setData(response.data); // Assuming the API response is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filter]);

  const setObjectData = async (data) => {
    setShowPopup(!showPopup);
    if(data ?? false){
      try {
        const response = await axios.get(`https://api.punkapi.com/v2/beers/${data}`);
        setSingleObject(...response.data); // Assuming the API response is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  // Calculate indexes for the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container-fluid'>
      <h1 className='text-center'>Beershop-list Table</h1>
      <button className='btn btn-primary m-1' onClick={()=>setfilter("brewed_after=11-2012")}>Brewed-before</button>
      <button className='btn btn-primary' onClick={()=>setfilter("brewed_before=11-2012")}>Brewed-after</button>
      <table className="table">
        <thead className='text-center'>
          <tr>
            <th>ID</th>
            <th>Img</th>
            <th>Name</th>
            <th>Tagline</th>
            <th>Description</th>
            <th>Contribution</th>
            <th>Tips</th>
            <th>Actions</th>
            {/* Add more headers based on your API response */}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><img src={item.image_url}  alt={item.image_url} className='img-fluid' style={{objectFit: 'cover' ,height:"80px", width:"25px"}}/></td>
              <td>{item.name}</td>
              <td>{item.tagline}</td>
              <td>{item.description}</td>
              <td>{item.contributed_by}</td>
              <td>{item.brewers_tips}</td>
              <td><button className="btn btn-warning" onClick={()=>setObjectData(item.id)}>View</button></td>
              {/* Add more cells based on your API response */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div>
        {data.length > recordsPerPage && (
          <ul className="pagination" style={{justifyContent:'center'}}>
            {Array.from({ length: Math.ceil(data.length / recordsPerPage) }).map((_, index) => (
              <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                <button onClick={() => paginate(index + 1)}>{index + 1}</button>
              </li>
              
            ))}
          </ul>
        )}
      </div>
      <Popup show={showPopup} handleClose={()=>setObjectData(null)}>
      </Popup>
    </div>
  );
};

// export default TableView;

const mapDispatchToProps = {
  setSingleObject,
};

export default connect(null, mapDispatchToProps)(TableView);