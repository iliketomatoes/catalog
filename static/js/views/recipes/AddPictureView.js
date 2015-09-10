define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    //'models/project/ProjectModel',
    //'collections/projects/ProjectsCollection',
    'text!templates/recipes/addPictureTemplate.html',
    'dropzone'
], function($, _, Backbone, addPictureTemplate, Dropzone) {
    var AddPictureView = Backbone.View.extend({
        el: $("#container"),

        render: function(id, name) {

            var data = {
                id: id,
                name: name,
                _: _
            };

            var compiledTemplate = _.template(addPictureTemplate)(data);
            this.$el.html(compiledTemplate);
            $("#upload-picture-form").dropzone({ url: "/uploadpicture/" + id });
        }
    });
    return new AddPictureView();
});
