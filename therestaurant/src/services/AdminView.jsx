import Web3 from "web3"
import { CONTRACT_ADDRESS, ABI_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import EditBooking from "./EditBookings";
import './AdminView.css';

export const AdminView = () => {

    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingIds, setBookingIds] = useState(null)

    const [newNumberOfGuest, setNewNumberOfGuest] = useState(1)
    const [newName, setNewName] = useState("")
    const [newDate, setNewDate] = useState("1")
    const [newTime, setNewTime] = useState(1)

    const border = "1px solid black";

    async function handleConnectWallet () {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await window.web3.eth.getAccounts();
          const contractInstance = new window.web3.eth.Contract(ABI_ADDRESS, CONTRACT_ADDRESS);
          setAccount(accounts[0]);
          setContract(contractInstance);
        }
      }

    async function handleCreateRestaurant() {
        const name = "My restaurant";
        await contract.methods.
        createRestaurant(name)
        .send({from: account})
        .once("receipt", async (receipt) => {
            console.log(receipt);
        })
    }


    async function fetchBookings() {
            const contract = new window.web3.eth.Contract(ABI_ADDRESS, CONTRACT_ADDRESS);
            const restaurantId = 1; 
            const bookingIds = await contract.methods.getBookings(restaurantId).call();
            const bookingsArray = [];
            for (let i = 0; i < bookingIds.length; i++) {
              const bookingId = bookingIds[i];
              const booking = await contract.methods.bookings(bookingId).call();
              bookingsArray.push(booking);         
            }
            setBookingIds(bookingIds)
            setBookings(bookingsArray);
          };

    useEffect(() => {
        handleConnectWallet();
        fetchBookings();
        
    }, []);

    async function handleEdit (e) {
      e.preventDefault();
      const bookingId = e.target.value;
      //const bookingId = bookingIds[index];
    
      console.log(bookingId);
      EditBooking(
        bookingId,
        newNumberOfGuest,
        newName,
        newDate,
        newTime
      );
    }


    return (
      <div className="admin-view">
        <h1 className="admin-view__heading">Welcome to AdminView</h1>
        <div className="admin-view__filter">
          <div className="admin-view__filter-group">
            <label htmlFor="time-filter" className="admin-view__filter-label">Sort by:</label>
            <select
              // onChange={(e) => setSortTime(e.target.value)}
              name="time"
              id="time-filter"
              className="admin-view__filter-select"
            >
              <option value="all">All times</option>
              <option value="12">Lunch</option>
              <option value="20">Dinner</option>
            </select>
          </div>
          <div className="admin-view__filter-group">
            <label htmlFor="date-filter" className="admin-view__filter-label">Filter by date:</label>
            <input
              type="date"
              name="date"
              id="date-filter"
              className="admin-view__filter-input"
              //onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-view__bookings">
          {bookings.map((booking, index) => (
            <div key={index} className="admin-view__booking">
              <div className="admin-view__booking-details">
                <p className="admin-view__booking-id">Booking ID: {booking.id}</p>
                <p className="admin-view__booking-guests">Number of Guests: {booking.numberOfGuests}</p>
                <p className="admin-view__booking-name">Name: {booking.name}</p>
                <p className="admin-view__booking-date">Date: {booking.date}</p>
                <p className="admin-view__booking-time">Time: {booking.time}:00</p>
                <p className="admin-view__booking-restaurant-id">Restaurant ID: {booking.restaurantId}</p>
              </div>
              <div className="admin-view__booking-edit">
                <input type="number" placeholder="Number of guests" className="admin-view__edit-input" onChange={(e) => setNewNumberOfGuest(e.target.value)} />
                <input type="text" placeholder="Name" className="admin-view__edit-input" onChange={(e) => setNewName(e.target.value)} />
                <input type="date" placeholder="Date" className="admin-view__edit-input" onChange={(e) => setNewDate(e.target.value)} />
                <select
                  onChange={(e) => setNewTime(e.target.value)}
                  name="time"
                  id="time"
                  className="admin-view__edit-select"
                >
                  <option value="">Choose time</option>
                  <option value="12">12:00</option>
                  <option value="20">20:00</option>
                </select>
                <button
                  onClick={(e) => handleEdit(e, booking.id)}
                  value={booking.id}
                  className="admin-view__edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }