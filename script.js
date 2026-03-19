const SB_URL = "https://tmxtrpcxgowyvsijptjy.supabase.co";
const SB_KEY = "sb_publishable_HyUD5W3MBGCUNYiNLOZHKQ_mMVcKa1-";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

const scoreForm = document.getElementById('scoreForm');
const submitBtn = document.getElementById('submitBtn');

scoreForm.onsubmit = async (e) => {
    e.preventDefault();
    
    // Disable button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerText = "Saving...";

    // Helper function to safely get checkbox value
    const isChecked = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    const formData = {
        full_name: document.getElementById('full_name').value || "Anonymous",
        total_correct: parseInt(document.getElementById('total_correct').value),
        category: document.getElementById('category').value,
        is_woman: isChecked('is_woman'),
        is_pstm: isChecked('is_pstm'),
        is_exser: isChecked('is_exser'),
        is_dw: isChecked('is_dw'),
        is_vi_lv: isChecked('is_vi_lv'),
        is_hi_hh: isChecked('is_hi_hh'),
        is_ld_cp: isChecked('is_ld_cp'),
        is_asd_md: isChecked('is_asd_md')
    };

    try {
        const { error } = await supabaseClient
            .from('candidate_scores')
            .insert([formData]);

        if (error) throw error;

        alert("Marks Submitted Successfully!");
        window.location.href = "dashboard.html"; // Navigate to rankings

    } catch (err) {
        console.error("Submission error:", err);
        alert("Error: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Marks";
    }
};
