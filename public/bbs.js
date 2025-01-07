"use strict";

let number=0;
const bbs = document.querySelector('#bbs');
//送るの
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
    });
});

document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            let value = response.number;
            console.log(value);

            console.log(number);
            if (number != value) {
                const params = {
                    method: "POST",
                    body: 'start=' + number,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                const url = "/read";
                fetch(url, params)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Error');
                        }
                        return response.json();
                    })
                    .then((response) => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            console.log(mes);  // 表示する投稿
                            let cover = document.createElement('div');
                            cover.className = 'cover';

                            let name_area = document.createElement('span');
                            name_area.className = 'name';
                            name_area.innerText = mes.name;

                            let mes_area = document.createElement('span');
                            mes_area.className = 'mes';
                            mes_area.innerText = mes.message;

                            let likes_area = document.createElement('span');
                            likes_area.className = 'likes';
                            likes_area.innerText = `　　いいね数: ${mes.likes || 0}`; // いいね数

                            // いいねボタン
                            let like_button = document.createElement('button');
                            like_button.innerText = 'いいね';
                            like_button.className = 'like-button';

                            //削除ボタン
                            let delete_button = document.createElement('button');
                            delete_button.innerText = '削除';
                            delete_button.className = 'delete-button';

                            // 編集ボタン
                            let edit_button = document.createElement('button');
                            edit_button.innerText = '編集';
                            edit_button.className = 'edit-button';

                            //いいね処理
                            like_button.addEventListener('click', () => {
                                const params = {
                                    method: "POST",
                                    body: `id=${mes.id}`,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                };
                                const url = "/like";
                                fetch(url, params)
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Error liking post');
                                        }
                                        return response.json();
                                    })
                                    .then((response) => {
                                        console.log(`Post ${mes.id} updated with likes: ${response.likes}`);
                                        likes_area.innerText = `　　いいね数: ${response.likes}`; // いいね数を更新
                                    })
                                    .catch((error) => console.error(error));
                            });

                            //削除処理
                            delete_button.addEventListener('click', () => {
                                const params = {
                                    method: "POST",
                                    body: `id=${mes.id}`,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                };
                                const url = "/delete";
                                fetch(url, params)
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Error deleting post');
                                        }
                                        return response.json();
                                    })
                                    .then((response) => {
                                        console.log('Post deleted');
                                        number = response.number    //投稿のやつ更新
                                        cover.remove();
                                    })
                                    .catch((error) => console.error(error));
                            });

                            // 編集処理
                            edit_button.addEventListener('click', () => {
                                const name = prompt("名前を入力してください", mes.name);
                                const message = prompt("メッセージを入力してください", mes.message);

                                if (name !== null && message !== null) {
                                    const params = {
                                        method: 'POST',
                                        body: `id=${mes.id}&name=${name}&message=${message}`,
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        }
                                    };
                                    const url = '/edit';
                                    fetch(url, params)
                                        .then(response => response.json())
                                        .then(response => {
                                            if (response.success) {
                                                name_area.innerText = response.post.name;
                                                mes_area.innerText = response.post.message;
                                            } else {
                                                console.error('編集に失敗しました');
                                            }
                                        })
                                        .catch(error => console.error('エラー:', error));
                                }
                            });

                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);
                            cover.appendChild(likes_area);
                            cover.appendChild(like_button);
                            cover.appendChild(delete_button);
                            cover.appendChild(edit_button);

                            bbs.appendChild(cover);
                        }
                    });
            }
        });
});