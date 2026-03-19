const SB_URL = "https://tmxtrpcxgowyvsijptjy.supabase.co";
const SB_KEY = "sb_publishable_HyUD5W3MBGCUNYiNLOZHKQ_mMVcKa1-";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

const scoreForm = document.getElementById('scoreForm');
const submitBtn = document.getElementById('submitBtn');

scoreForm.onsubmit = async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Saving...";

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

        alert("Marks Submitted!");
        window.location.href = "dashboard.html"; // Redirect to see results

    } catch (err) {
        alert("Error: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Marks";
    }
};
