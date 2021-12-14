$(function() {
    // for tags:
    // have a value for the input field for name="tags" set to nothing at first, but if tags are added,
    // use jQuery to add tags to the input field (value) and then send it as an array
    // constants

    // use input type = hidden so the user can't edit the input field's 
    // values

    // variables
    let tagsArray = [];

    // cached element references
    const $tagsHidden = $("#tags-hidden");
    const $tagsInput = $("#tags-input");
    const $tagButton = $("#tag-btn");
    const $addForm = $("#add-form");
    const $tagsDisplay = $("#tags-display");
    const $removeTagButton = $(".remove-tag-btn");

    // event listeners

    $tagButton.on('click', handleClick);
    $addForm.on('submit', handleSubmit);
    $tagsDisplay.on('click', '.remove-tag-btn', handleRemoveTag);

    // functions

    function handleClick(evt) {
        evt.preventDefault();
        const tag = $tagsInput.val();
        if(tag) {
            tagsArray.push(tag);
            // const tagString = tagsArray.join();
            console.log(tagsArray);
            $tagsHidden.val(tagsArray);
            $tagsInput.val("");
            $tagsDisplay.append(`
                <span class="tag badge rounded-pill bg-info text-dark">
                    ${tag}<span class="badge bg-light text-dark remove-tag-btn">x</span>
                </span>
            `);
        }
    }

    function handleRemoveTag(evt) {
        evt.preventDefault();
        const $tag = evt.currentTarget.closest(".tag");
        // get just text and remove white space
        const tagText = $($($tag).contents()[0]).text().trim();
        $tag.remove();
        // remove tag from tagsArray
        tagsArray = $.grep(tagsArray, function(value, idx) {
            return value !== tagText;
        });
        $tagsHidden.val(tagsArray);
    }

    function handleSubmit() {
        tagsArray = [];
    }

});