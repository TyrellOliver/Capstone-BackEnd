const express = require("express");
const {
  getAllFriendReuests,
  createFriends,
  getFriendRequests,
  deleteFriendRequest,
  getSingleFriend,
  updateFriend,
} = require("../queries/friends");
const friendRequest = express.Router();


// get all friends requests
friendRequest.get("/", async (req, res) =>{
  try {
    const allRequests = await getAllFriendReuests()
    res.status(200).json(allRequests)
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"})
  }
})


// get all friends requests
friendRequest.get("/mine", async (req, res) => {
  try {
    const id = req.user.userId;
    // if (userprofile_id !== req.user.userId.toString()) {
    //   return res
    //     .status(403)
    //     .json({ error: "Forbidden - You can only acess your own profile" });
    // }
    const friends = await getFriendRequests(id);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get a single friend request
friendRequest.get(
  "/:receiver_user_profile_id/:connectionrequests_id",
  async (req, res) => {
    try {
      const { receiver_user_profile_id, connectionrequests_id } = req.params;
      const singleFriendRequest = await getSingleFriend(
        receiver_user_profile_id,
        connectionrequests_id
      );
      res.status(200).json(singleFriendRequest);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "Friend Request Not Found" });
    }
  }
);

// a single post from a friend request
friendRequest.post("/", async (req, res) => {
  try {
    const friendRequest = await createFriends(req.body);
    res.status(200).json(friendRequest);
  } catch (error) {
    return error;
  }
});
// update a friend request
friendRequest.put(
  "/:connectionrequests_id/:sender_user_profile_id",
  async (req, res) => {
    try {
      const { connectionrequests_id, sender_user_profile_id } = req.params;
      const { receiver_user_profile_id, status, timestamp } = req.body;
      const updatedFriend = await updateFriend(
        connectionrequests_id,
        sender_user_profile_id,
        receiver_user_profile_id,
        status,
        timestamp
      );
      res.status(200).json(updatedFriend);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Friend Request Server Error" });
    }
  }
);
// delete friend request
friendRequest.delete(
  "/:sender_user_profile_id/:receiver_user_profile_id",
  async (req, res) => {
    try {
      const {
        sender_user_profile_id,
        receiver_user_profile_id,
        status,
        timestamp,
      } = req.params;
      const deleteRequest = await deleteFriendRequest(
        sender_user_profile_id,
        receiver_user_profile_id,
        status,
        timestamp
      );
      res.status(200).json({ success: "Successfully deleted friend request" });
      return deleteRequest;
    } catch (error) {
      res.status(404).json({ error: "Error deleting friend request" });
    }
  }
);
module.exports = friendRequest;
