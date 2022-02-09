extern "C" {
    int GetArgumentValue(int infoptr, int index) {
        return infoptr | index;
    }
    // int GetJsValueType(void* isolate, int val, bool isByRef) {
    //     int index = val & 15;
    //     int ptr = val >> 4;
    //     int* typeValue = (int*)(ptr + index * sizeof(int));
    //     return *typeValue;
    // }
}