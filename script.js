// 1. Configuration
const SB_URL = "https://tmxtrpcxgowyvsijptjy.supabase.co";
const SB_KEY = "sb_publishable_HyUD5W3MBGCUNYiNLOZHKQ_mMVcKa1-";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

const communities = ['GT', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
let allData = []; // Store fetched data locally for instant filtering

// 2. Initialization
document.addEventListener('DOMContentLoaded', () => {
    setupDashboard();
    fetchAndDisplayScores();
});

// 3. Setup the Dashboard UI Columns
function setupDashboard() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = ''; // Clear existing
    
    communities.forEach(comm => {
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.innerHTML = `
            <div class="cat-title">
                <span>${comm}</span>
                <select class="filter-select" onchange="handleFilterChange('${comm}', this.value)">
                    <option value="ALL">ALL</option>
                    <option value="W">Woman</option>
                    <option value="PSTM">PSTM</option>
                    <option value="W_PSTM">W + PSTM</option>
                    <option value="EXSER">Ex-Ser</option>
                </select>
            </div>
            <div class="score-list" id="list-${comm}">
                <p class="status-text">Loading...</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. Fetch Data from Supabase
async function fetchAndDisplayScores() {
    const { data, error } = await supabaseClient
        .from('candidate_scores')
        .select('*')
        .order('total_correct', { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
        return;
    }

    allData = data; // Save to global variable
    renderAllColumns(allData);
}

// 5. Render Lists for all Columns
function renderAllColumns(dataToRender) {
    communities.forEach(comm => {
        const listDiv = document.getElementById(`list-${comm}`);
        const categoryData = dataToRender.filter(d => d.category === comm);
        renderSingleList(listDiv, categoryData);
    });
}

function renderSingleList(container, data) {
    if (data.length === 0) {
        container.innerHTML = `<p class="status-text">No entries</p>`;
        return;
    }
    
    container.innerHTML = data.map(d => `
        <div class="score-row">
            <span class="name-tag">
                ${d.full_name || 'Anon'} 
                <small class="tags">${generateTags(d)}</small>
            </span>
            <span class="score-val">${d.total_correct}</span>
        </div>
    `).join('');
}

// 6. Filtering Logic
function handleFilterChange(comm, filterType) {
    const listDiv = document.getElementById(`list-${comm}`);
    let filtered = allData.filter(d => d.category === comm);

    if (filterType === "W") {
        filtered = filtered.filter(d => d.is_woman);
    } else if (filterType === "PSTM") {
        filtered = filtered.filter(d => d.is_pstm);
    } else if (filterType === "W_PSTM") {
        filtered = filtered.filter(d => d.is_woman && d.is_pstm);
    } else if (filterType === "EXSER") {
        filtered = filtered.filter(d => d.is_exser);
    }

    renderSingleList(listDiv, filtered);
}

// 7. Helper: Generate UI Tags
function generateTags(d) {
    let t = [];
    if (d.is_woman) t.push('W');
    if (d.is_pstm) t.push('P');
    if (d.is_exser) t.push('Ex');
    if (d.is_dw) t.push('DW');
    return t.length ? `[${t.join(',')}]` : '';
}

// 8. Form Submission Logic
const scoreForm = document.getElementById('scoreForm');
const submitBtn = document.getElementById('submitBtn');

scoreForm.onsubmit = async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = {
        full_name: document.getElementById('full_name').value || "Anonymous",
        total_correct: parseInt(document.getElementById('total_correct').value),
        category: document.getElementById('category').value,
        is_woman: document.getElementById('is_woman').checked,
        is_pstm: document.getElementById('is_pstm').checked,
        is_exser: document.getElementById('is_exser').checked,
        is_dw: document.getElementById('is_dw').checked,
        is_vi_lv: document.getElementById('is_vi_lv').checked,
        is_hi_hh: document.getElementById('is_hi_hh').checked,
        is_ld_cp: document.getElementById('is_ld_cp').checked,
        is_asd_md: document.getElementById('is_asd_md').checked
    };

    try {
        const { error } = await supabaseClient
            .from('candidate_scores')
            .insert([formData]);

        if (error) throw error;

        alert("Success! Your score is added to the dashboard.");
        scoreForm.reset();
        fetchAndDisplayScores(); // Refresh the list immediately

    } catch (err) {
        alert("Submission Failed: " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit My Marks";
    }
};
