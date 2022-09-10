'use strict';

module.exports = function (socket, io, onlineUsers) { 
    /*
    入室メッセージをクライアントに送信する
    引数 data = {
        userName: <ユーザ名>,
    }
    */
    socket.on('enter', function (data) {
        if (!data.userName) {
            return;
        }

        const counter = onlineUsers.findIndex(user => user.name === data.userName);
        if (counter >= 0) {
            socket.emit('handleEnterErrorEvent', {'error': 1});
            return;
        }

        // socket ID 取得
        const userId = socket.id;
        data.userId = userId;
        onlineUsers.push({ id: data.userId, name: data.userName });

        const message = '<span class="member-name">' + data.userName + 'さん' + '</span>'
                        + '<input type="hidden" value="' + data.userId + '">'
                        + '<span>が入室しました</span>';
        data.message = message;
        // 自身への処理
        socket.emit('receiveEnterEventMyself', data);
        // 他人への処理
        socket.broadcast.emit('receiveEnterEvent', data);
        io.sockets.emit('appendOnlineUsersEvent', onlineUsers);
    });
};
