const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("../proto/todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:40000",
    grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service,
    {
        "createTodo": createTodo,
        "readTodos" : readTodos,
        "readTodosStream": readTodosStream,
        "deleteTodo": deleteTodo
    });
server.start();
console.log(`gRPC Server Start on 0.0.0.0:40000`);


let todos = []
function createTodo (call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem)
    callback(null, todoItem);
}


function readTodosStream(call, callback) {

    todos.forEach(t => call.write(t));
    call.end();
}

function readTodos(call, callback) {
    callback(null, {"items": todos})
}

function deleteTodo(call, callback) {
    const todoId = call.request.id;
    todos = todos.filter(todo => todo.id !== todoId);
    callback(null);
}
