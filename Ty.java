class Ty {
    public static void main(String[] args) {
        
       otl: for(int i=1 ; i<=3 ; i++){
            for(int j=1;j<=5;j++){
                System.out.println(i + " " + j);
                if (j==2){
                    break otl;
                }
                System.out.println();

            }
            System.out.println();
        }
        
    }
}