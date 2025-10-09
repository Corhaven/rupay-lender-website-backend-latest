const socketIo = require('socket.io');
const notificationModel = require('../models/notificationModel');

let io;

function socketInit(server) {
  io = socketIo(server, {
    cors: {
      origin:["http://localhost:3000", "https://vendor.rupaylender.com","http://localhost:5173","https://adminweb.rupaylender.com"], // Adjust to your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    // console.log('New client connected');

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
}
const notifyAdmin = async (vendorId, title,message) => {
    try {
        
   
    // const user = await User.findById(userId);
    const notification = new notificationModel({ vendorId: vendorId,title, message });
    await notification.save();
  
    io.emit('notification', { vendorId, title,message });
      
    // if (user.mobile) {
    //   sendSms(user.mobile, message);
    // }
} catch (error) {
     console.log(error.message)   
}
  };
module.exports = { socketInit, getIo,notifyAdmin };
