db.results.aggregate([ {$match : {"course.teacher" : "PCS181" }}, {$project : {USN :1, course : {$filter : { input : "$course", as: "course", cond :{$and:[ {$eq : ["$$course.teacher","PCS181"]}, {$eq :["$$course.c_id","UE16CS170"]}] }} }}} ])

{t_id : "sfv", course:[{USN : "eg", ISA1:98, ISA2 :66},{}]}





{"u" : {"internals" : { "ISA1" : {  "m" : [{"marks_a" : 40}, {"marks_sd" : 10}] } },{ "ISA2" : {  "m" : [{"marks_a" : 40}, {"marks_sd" : 10}] }}, {"Assignment" :  {  "m" : [{"marks_a" : 200}, {"marks_sd" : 20} ] } } } ,{"externals" : { "ESA" : {"m" : [{"marks_a" : 60}, {"marks_sd" : 40}] }},{"project" : { "m" : [{"marks_a" : 20}, {"marks_sd" : 20}] } }  } } 


{"u" : {"internals" : { "ISA1" : {  "m" : [{"marks_a" : 40}, {"marks_sd" : 10}] } } } }


using namespace std;

#define arr (*(a+i*n+j))

int lcs(string s1, string s2, int i, int j, int* a){
    int m = s1.length();
    int n = s2.length();
    int val;
    //int ele = arr;
    
    if(i==m || j==n){
        return 0;
    }
    
    if(arr != -1){
        return (arr);
    }
    
    if (s1[i] == s2[j]){
        val = 1+lcs(s1,s2,i+1,j+1,a);
    }
    else if(s1[i] != s2[j]){
        val = (max(lcs(s1,s2,i,j+1,a),lcs(s1,s2,i+1,j,a)));
    }
    arr = val;
    return val;
}

int main() {
	//code
	int t;
	cin>>t;
	while(t--){
	    int m,n;
	    string s1,s2;
	    cin>>m;
	    cin>>n;
	    cin>>s1;
	    cin>>s2;
	    int a[m][n];
	    for(int i=0;i<m;i++){
	        for(int j=0;j<n;j++){
	            a[i][j] = -1;
	        }
	    }
	    cout<<(lcs(s1,s2,0,0,(int*)a))<<endl;
	}
	return 0;
}