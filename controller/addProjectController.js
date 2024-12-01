const AddProject = require("../models/AddProject");
const uploadonCloudinary = require("../utils/cloudinary");




exports.NewProjectAdd = async(req ,res) =>{

    try {
        
        const { name, description, liveUrl, sourceCode } = req.body;

        
        // Validate input fields
        if (!name || !description || !liveUrl || !sourceCode) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated." });
        }

        let imageUrl = null;

        //upload image to cloudinary
        if(req.file && req.file.path){
            const uploadResponse  = await uploadonCloudinary(req.file.path);
        

        if(uploadResponse){
            imageUrl = uploadResponse.secure_url;

        }   else {
            return res.status(500).json({ message: "Image upload failed." });
        }
    
    } 

    //save project to data base 

    const newProject  = new AddProject({
        addedBy:req.user.id,
        name,
        description,
        image:imageUrl || undefined ,
        liveUrl,
        sourceCode,
    });

    await newProject.save();
    

    return res.status(201).json({
        message: "project uploaded successfully",
        newProject,
        
    });


    } catch (error) {

        console.error("Error in NewProjectAdd:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    
        
    }
}




exports.GetAllProjects = async (req, res) => {
    try {
        
        const projects = await AddProject.find().select('-addedBy')

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        });
    } catch (error) {
        console.error("Error in GetAllProjects:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};


exports.EditProject = async (req, res) => {
    try {
        const { projectId, name, description, liveUrl, sourceCode } = req.body;

        // Validate required fields
        if (!projectId || !name || !description || !liveUrl || !sourceCode) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated." });
        }

        // Find the project by ID
        const project = await AddProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        if (project.addedBy.toString() !== req.user.id && !req.user.admin) {
            return res.status(403).json({ message: "You are not authorized to edit this project." });
        }
        

        // Check if a new image is provided, then upload it to Cloudinary
        let imageUrl = project.image;

        if (req.file && req.file.path) {
            const uploadResponse = await uploadonCloudinary(req.file.path);
            if (uploadResponse) {
                imageUrl = uploadResponse.secure_url;
            } else {
                return res.status(500).json({ message: "Image upload failed." });
            }
        }

        // Update the project
        project.name = name;
        project.description = description;
        project.liveUrl = liveUrl;
        project.sourceCode = sourceCode;
        project.image = imageUrl;

        await project.save();

        return res.status(200).json({
            message: "Project updated successfully",
            project,
        });

    } catch (error) {
        console.error("Error in EditProject:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};



exports.DeleteProject = async(req , res) =>{

    try {
        const { projectId } = req.params;
        if(!projectId){
            return res.status(400).json({ message: "Project ID is required!" })
        }

         // Check if user is authenticated
         if(!req.user || !req.user.id){
            return res.status(401).json({ message: "Unauthorized: User not authenticated." });

         }

         const project = await AddProject.findById(projectId)

         if(!project){
            return res.status(404).json({ message: "Project not found." });

         }

         // Authorization: Check if the user is the owner or an admin
         if (project.addedBy.toString() !== req.user.id && !req.user.admin) {
            return res.status(403).json({ message: "You are not authorized to delete this project." });
        }

        await AddProject.findByIdAndDelete(projectId);
        return res.status(200).json({ message: "Project deleted successfully!" });



    } catch (error) {

        console.error("Error in DeleteProject:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    


    }
}