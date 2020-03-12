const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("../proto/todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const commands = {
    "c": "CREATE",
    "d": "DELELTE"
};

const client = new todoPackage.Todo("localhost:40000",
    grpc.credentials.createInsecure())

const command = process.argv[2];
const userInputText = process.argv[3];

const currentCommand = commands[command];
if(currentCommand) {
    if(currentCommand === commands.c) {
        const text = userInputText;
        createTodoCommand(text);
    } else if(currentCommand === commands.d) {
        const todoId = userInputText;
        deleteTodoCommand(todoId);
    }
}

function createTodoCommand(text) {
    client.createTodo({
        "id": -1,
        "text": text
    }, (err, response) => {

        console.log("Recieved from server " + JSON.stringify(response));

    });
}

function deleteTodoCommand(todoId) {
    client.deleteTodo({
        "id": 1
    }, (err, response) => {

        console.log("Remove from server todo with id = " + todoId);

    })
}

/*
client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response))
    if (!response.items)
        response.items.forEach(a=>console.log(a.text));
})
*/

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})

call.on("end", e => console.log("server done!"))
