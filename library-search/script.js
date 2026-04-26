const API_KEY = 'f52785d896f4158780773030ca4fb5cf';
const CALIL_API = 'https://api.calil.jp/library';

const getLocationBtn = document.getElementById('getLocationBtn');
const locationText = document.getElementById('locationText');
const librariesContainer = document.getElementById('librariesContainer');
const errorText = document.getElementById('errorText');
const loadingText = document.getElementById('loadingText');
const noLibraries = document.getElementById('noLibraries');

let userLat = null;
let userLng = null;

getLocationBtn.addEventListener('click', getLocation);

function getLocation() {
    getLocationBtn.disabled = true;
    getLocationBtn.textContent = '取得中...';
    errorText.classList.remove('show');

    if (!navigator.geolocation) {
        showError('お使いのブラウザは位置情報機能に対応していません');
        getLocationBtn.disabled = false;
        getLocationBtn.textContent = '📍 現在地を取得';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            locationText.textContent = `緯度: ${userLat.toFixed(4)}, 経度: ${userLng.toFixed(4)}`;
            searchLibraries();
        },
        (error) => {
            let message = '位置情報の取得に失敗しました';
            if (error.code === error.PERMISSION_DENIED) {
                message = '位置情報へのアクセスが許可されていません';
            }
            showError(message);
            getLocationBtn.disabled = false;
            getLocationBtn.textContent = '📍 現在地を取得';
        }
    );
}

async function searchLibraries() {
    loadingText.classList.add('show');
    librariesContainer.innerHTML = '';

    try {
        const response = await fetch(
            `${CALIL_API}?appkey=${API_KEY}&lat=${userLat}&lng=${userLng}&limit=20`
        );

        if (!response.ok) {
            throw new Error('API呼び出しに失敗しました');
        }

        const data = await response.json();

        if (!data.libraries || data.libraries.length === 0) {
            noLibraries.textContent = 'この地域の図書館が見つかりませんでした';
            librariesContainer.appendChild(noLibraries);
            loadingText.classList.remove('show');
            getLocationBtn.disabled = false;
            getLocationBtn.textContent = '📍 現在地を取得';
            return;
        }

        displayLibraries(data.libraries);
    } catch (error) {
        console.error('エラー:', error);
        showError('図書館検索中にエラーが発生しました: ' + error.message);
    } finally {
        loadingText.classList.remove('show');
        getLocationBtn.disabled = false;
        getLocationBtn.textContent = '📍 現在地を取得';
    }
}

function displayLibraries(libraries) {
    librariesContainer.innerHTML = '';

    libraries.forEach((lib) => {
        const card = document.createElement('div');
        card.className = 'library-card';

        const statusClass = lib.status === '開館中' ? 'status-open' :
                          lib.status === '閉館中' ? 'status-closed' : 'status-unknown';

        const statusHtml = lib.status ?
            `<span class="library-status ${statusClass}">${lib.status}</span>` : '';

        card.innerHTML = `
            <div class="library-name">${lib.formal}</div>
            <div class="library-info">
                ${lib.address ? `<div class="info-row"><span class="info-label">住所</span><span>${lib.address}</span></div>` : ''}
                ${lib.tel ? `<div class="info-row"><span class="info-label">電話</span><span>${lib.tel}</span></div>` : ''}
                ${lib.url ? `<div class="info-row"><span class="info-label">URL</span><span><a href="${lib.url}" target="_blank" style="color: #667eea;">ウェブサイト</a></span></div>` : ''}
                ${lib.post ? `<div class="info-row"><span class="info-label">郵便番号</span><span>${lib.post}</span></div>` : ''}
            </div>
            ${statusHtml}
        `;

        librariesContainer.appendChild(card);
    });

    const count = document.createElement('div');
    count.className = 'library-count';
    count.textContent = `${libraries.length}件の図書館が見つかりました`;
    librariesContainer.appendChild(count);
}

function showError(message) {
    errorText.textContent = message;
    errorText.classList.add('show');
}
