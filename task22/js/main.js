var btn = $('button', $('#sort-options')),

    treeRoot = $('#tree-root'),
    //二叉树树最后一项
    lastLeaf = $('#last-leaf');

addHandler(btn[0], 'click', function preorderTraversal() {
    /*
        前序遍历
        利用栈结构实现
    */
    //记录遍历栈
    var traversalStack = [],
        //遍历到的当前节点
        root = treeRoot,
        //遍历过程中的上一个节点（如果有）
        lastTraversalItem;

    intervalID = setInterval(function () {

        if (lastTraversalItem) {
            lastTraversalItem.className = '';
        }

        root.className = 'current-node';
        traversalStack.push(root);
        lastTraversalItem = root;

        if (root === lastLeaf) {
            setTimeout(function () {
                lastTraversalItem.className = '';
                clearInterval(intervalID);
            }, 1000);

            return;
        }

        root = root.firstElementChild;

        if (!root) {
            traversalStack.pop();
            root = traversalStack[traversalStack.length - 1].lastElementChild;
            traversalStack.pop();
        }

    }, 1000);
});

addHandler(btn[1], 'click', function inorderTraversal() {
    /*
        中序遍历
        利用栈结构实现
    */
    //记录遍历栈
    var traversalStack = [],
        //遍历到的当前节点
        root = treeRoot,
        //遍历过程中的上一个节点（如果有）
        lastTraversalItem;

    intervalID = setInterval(function () {

        if (lastTraversalItem) {
            lastTraversalItem.className = '';
        }

        if (root.inStack1) {
            root.className = 'current-node';
            lastTraversalItem = root;
            root = traversalStack.pop();
            root = root.lastElementChild;

            return;
        }

        //已入栈的项目inStack属性设置为true
        root.inStack1 = true;
        traversalStack.push(root);
        
        if (root === lastLeaf) {
            root.className = 'current-node';

            setTimeout(function () {
                lastTraversalItem.className = '';
                clearInterval(intervalID);
            }, 1000);

            return;
        }

        root = root.firstElementChild;

        if (!root) {
            root = traversalStack.pop();
            root.className = 'current-node';
            lastTraversalItem = root;
            root = traversalStack[traversalStack.length - 1];
        }

    }, 1000);
});

addHandler(btn[2], 'click', function postorderTraversal() {
    /*
        后序遍历
        利用栈结构实现
    */
    //记录遍历栈
    var traversalStack = [],
        //遍历到的当前节点
        root = treeRoot,
        //遍历过程中的上一个节点（如果有）
        lastTraversalItem;

    intervalID = setInterval(function () {

        if (lastTraversalItem) {
            lastTraversalItem.className = '';
        }

        if (root === treeRoot && root.inStack2) {
            root.className = 'current-node';
            setTimeout(function () {
                root.className = '';
                clearInterval(intervalID);
            }, 1000);

            return;
        }

        if (root.inStack2) {
            root.className = 'current-node';
            lastTraversalItem = root;
            root = root.nextElementSibling;

            if (!root) {
                root = traversalStack.pop();
            }

            return;
        }

        root.inStack2 = true;
        traversalStack.push(root);

        root = root.firstElementChild;

        if (!root) {
            root = traversalStack.pop();
            root.className = 'current-node';
            lastTraversalItem = root;
            root = root.nextElementSibling;

            if (!root) {
                root = traversalStack.pop();
            }
        }

    }, 1000);
});